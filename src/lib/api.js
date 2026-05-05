// Adapter for the Rijksmuseum Linked Open Data API.
// The legacy `www.rijksmuseum.nl/api/...` endpoint was shut down on 2026-01-05;
// requests now have to go through the Search API + Persistent Identifier Resolver
// at data.rijksmuseum.nl. No API key is required.

const SEARCH_API = "https://data.rijksmuseum.nl/search/collection";
const RESOLVER_HOST = "https://id.rijksmuseum.nl";
const PLACEHOLDER_IMAGE = "/noimage.png";
// The Search API doesn't accept a page-size parameter (returns 100 per page);
// we slice client-side to avoid resolving every result individually.
const DEFAULT_RESULT_LIMIT = 24;
const TITLE_AAT = "aat/300404670";

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/ld+json, application/json" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function search(params) {
  const url = new URL(SEARCH_API);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }
  const data = await fetchJson(url.toString());
  return Array.isArray(data?.orderedItems) ? data.orderedItems : [];
}

async function resolveOne(idUrl) {
  if (!idUrl) return null;
  try {
    return await fetchJson(idUrl);
  } catch {
    const sep = idUrl.includes("?") ? "&" : "?";
    try {
      return await fetchJson(`${idUrl}${sep}_profile=alt`);
    } catch (error) {
      console.error("Could not resolve", idUrl, error);
      return null;
    }
  }
}

function idToSlug(idUrl) {
  if (!idUrl) return null;
  return String(idUrl)
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/\/+$/, "");
}

function toResolverUrl(idLike) {
  if (!idLike) return null;
  const value = String(idLike);
  if (/^https?:\/\//.test(value)) return value;
  return `${RESOLVER_HOST}/${value}`;
}

function getType(node) {
  return node?.type || node?.["@type"] || "";
}

function getId(node) {
  return node?.id || node?.["@id"] || null;
}

function isClassifiedAs(node, fragment) {
  const list = node?.classified_as ?? [];
  return list.some((c) => (getId(c) || "").includes(fragment));
}

function extractTitle(obj) {
  const ids = obj?.identified_by ?? [];
  const names = ids.filter((n) => String(getType(n)).includes("Name"));
  if (names.length) {
    const titleish = names.find((n) => isClassifiedAs(n, TITLE_AAT));
    return (titleish ?? names[0])?.content ?? null;
  }
  return obj?._label ?? null;
}

function extractCreator(obj) {
  const productions = []
    .concat(obj?.produced_by ?? [])
    .concat(obj?.created_by ?? []);
  for (const prod of productions) {
    const actors = []
      .concat(prod?.carried_out_by ?? [])
      .concat(prod?.part?.flatMap?.((p) => p?.carried_out_by ?? []) ?? []);
    for (const actor of actors) {
      const label = actor?._label || actor?.label;
      if (label) return label;
      const namedBy = (actor?.identified_by ?? []).find((n) => n?.content);
      if (namedBy) return namedBy.content;
    }
  }
  return null;
}

function extractImageUrl(obj) {
  const reps = obj?.representation ?? [];
  for (const rep of reps) {
    const direct = getId(rep);
    if (direct && /\.(jpe?g|png|webp|tiff?)(\?|$)/i.test(direct)) return direct;

    const dsbList = rep?.digitally_shown_by ?? [];
    for (const dsb of dsbList) {
      const accessPoints = dsb?.access_point ?? [];
      for (const ap of accessPoints) {
        const url = getId(ap);
        if (url) return url;
      }
      const dsbId = getId(dsb);
      if (dsbId) return dsbId;
    }

    const showsList = rep?.shows ?? [];
    for (const shown of showsList) {
      const ap = (shown?.access_point ?? [])[0];
      const url = getId(ap);
      if (url) return url;
    }
  }
  return null;
}

function extractDate(obj) {
  const productions = [].concat(obj?.produced_by ?? []);
  for (const prod of productions) {
    const ts = prod?.timespan;
    if (!ts) continue;
    if (ts._label) return ts._label;
    const labelled = (ts.identified_by ?? []).find((n) => n?.content);
    if (labelled) return labelled.content;
    const begin = ts.begin_of_the_begin || ts.begin;
    if (begin) return String(begin).slice(0, 4);
  }
  return null;
}

function extractDescription(obj) {
  const refs = obj?.referred_to_by ?? [];
  const text = refs
    .map((r) => r?.content)
    .filter(Boolean)
    .join("\n\n");
  return text || null;
}

function extractDimensions(obj) {
  const dims = obj?.dimension ?? [];
  return dims.map((d) => ({
    value: d?.value ?? null,
    unit: d?.unit?._label ?? null,
    type: d?.classified_as?.[0]?._label ?? null,
  }));
}

function extractMedium(obj) {
  const made = obj?.made_of ?? [];
  return made.map((m) => m?._label).filter(Boolean).join(", ") || null;
}

function toCardModel(obj) {
  if (!obj) return null;
  return {
    title: extractTitle(obj) || "No title",
    author: extractCreator(obj) || "Unknown author",
    imageUrl: extractImageUrl(obj) || PLACEHOLDER_IMAGE,
    artId: idToSlug(getId(obj)),
    date: extractDate(obj) || " ",
  };
}

async function searchAndExpand(params, limit = DEFAULT_RESULT_LIMIT) {
  const items = await search(params);
  const ids = items.map(getId).filter(Boolean).slice(0, limit);
  const objects = await Promise.all(ids.map(resolveOne));
  return objects.map(toCardModel).filter(Boolean);
}

export async function getByName(queryName) {
  try {
    return await searchAndExpand({ q: queryName });
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function getByMaker(queryMaker) {
  try {
    return await searchAndExpand({ creator: queryMaker });
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// The resolver only accepts priref-style numeric IDs or full id.rijksmuseum.nl
// URLs. Legacy objectNumbers like "SK-C-5" must be looked up via the Search API
// first.
function looksLikePriref(value) {
  return /^\d+$/.test(String(value));
}

export async function getById(id) {
  try {
    if (id == null || id === "") return null;
    const value = String(id);

    let raw = null;
    if (/^https?:\/\//.test(value) || looksLikePriref(value)) {
      raw = await resolveOne(toResolverUrl(value));
    }
    if (!raw) {
      const items = await search({ objectNumber: value });
      const firstId = getId(items[0]);
      if (firstId) raw = await resolveOne(firstId);
    }
    if (!raw) return null;

    const title = extractTitle(raw);
    const author = extractCreator(raw);
    const imageUrl = extractImageUrl(raw);
    const date = extractDate(raw);
    const description = extractDescription(raw);
    const dimensions = extractDimensions(raw);
    const medium = extractMedium(raw);

    return {
      ...raw,
      longTitle: title || "Untitled",
      label: { makerLine: author || "Unknown author" },
      plaqueDescriptionEnglish: description,
      description,
      dating: { presentingDate: date },
      dimensions,
      physicalMedium: medium,
      webImage: imageUrl ? { url: imageUrl } : null,
      artId: idToSlug(getId(raw)),
    };
  } catch (error) {
    console.error("Error fetching data:", error?.message || error);
    return null;
  }
}
