// Adapter for the Rijksmuseum Linked Open Data API.
// The legacy `www.rijksmuseum.nl/api/...` endpoint was shut down on 2026-01-05;
// requests now have to go through the Search API + Persistent Identifier Resolver
// at data.rijksmuseum.nl. No API key is required.

const SEARCH_API = "https://data.rijksmuseum.nl/search/collection";
const RESOLVER_HOST = "https://id.rijksmuseum.nl";
const PLACEHOLDER_IMAGE = "/noimage.png";
// The Search API returns 100 results per page and rejects pageSize; we cap
// client-side to keep request volume reasonable when expanding into details.
const DEFAULT_RESULT_LIMIT = 12;

const LANG_EN = "aat/300388277";
const TITLE_BRIEF_AAT = "aat/300404670";
const TITLE_FULL_AAT = "aat/300417200";
const DESCRIPTION_AAT = "aat/300048722";

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
  } catch (error) {
    console.error("Could not resolve", idUrl, error);
    return null;
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

function getId(node) {
  if (node == null) return null;
  if (typeof node === "string") return node;
  return node.id || node["@id"] || null;
}

function getType(node) {
  return node?.type || node?.["@type"] || "";
}

function isClassifiedAs(node, fragment) {
  const list = node?.classified_as ?? [];
  return list.some((c) => (getId(c) || "").includes(fragment));
}

function inLanguage(node, langFragment) {
  const langs = node?.language ?? [];
  return langs.some((l) => (getId(l) || "").includes(langFragment));
}

function getNotationValue(notations, languageCode) {
  if (!Array.isArray(notations)) return null;
  const preferred = notations.find((n) => n?.["@language"] === languageCode);
  return (preferred ?? notations[0])?.["@value"] ?? null;
}

function walk(node, visit) {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit);
    return;
  }
  if (typeof node === "object") {
    visit(node);
    for (const key of Object.keys(node)) walk(node[key], visit);
  }
}

function extractTitle(obj) {
  const names = (obj?.identified_by ?? []).filter((n) =>
    String(getType(n)).includes("Name"),
  );
  if (!names.length) return obj?._label ?? null;
  const brief = names.filter((n) => isClassifiedAs(n, TITLE_BRIEF_AAT));
  const briefEn = brief.find((n) => inLanguage(n, LANG_EN));
  return (briefEn ?? brief[0] ?? names[0])?.content ?? null;
}

function extractLongTitle(obj) {
  const names = (obj?.identified_by ?? []).filter((n) =>
    String(getType(n)).includes("Name"),
  );
  const full = names.filter((n) => isClassifiedAs(n, TITLE_FULL_AAT));
  const fullEn = full.find((n) => inLanguage(n, LANG_EN));
  return (fullEn ?? full[0])?.content ?? null;
}

function extractCreator(obj) {
  const productions = [].concat(obj?.produced_by ?? []);
  for (const prod of productions) {
    const direct = prod?.carried_out_by ?? [];
    const nested = (prod?.part ?? []).flatMap((p) => p?.carried_out_by ?? []);
    for (const actor of [...direct, ...nested]) {
      const fromNotation =
        getNotationValue(actor?.notation, "en") ||
        getNotationValue(actor?.notation, "nl");
      if (fromNotation) return fromNotation;
      if (actor?._label) return actor._label;
      const named = (actor?.identified_by ?? []).find((n) => n?.content);
      if (named) return named.content;
    }
    const refs = prod?.referred_to_by ?? [];
    const en = refs.find((r) => inLanguage(r, LANG_EN) && r?.content);
    if (en) return en.content;
    const any = refs.find((r) => r?.content);
    if (any) return any.content;
  }
  return null;
}

function extractDate(obj) {
  const productions = [].concat(obj?.produced_by ?? []);
  for (const prod of productions) {
    const ts = prod?.timespan;
    if (!ts) continue;
    const enId = (ts.identified_by ?? []).find(
      (n) => inLanguage(n, LANG_EN) && n?.content,
    );
    if (enId) return enId.content;
    const anyId = (ts.identified_by ?? []).find((n) => n?.content);
    if (anyId) return anyId.content;
    if (ts._label) return ts._label;
    const begin = ts.begin_of_the_begin || ts.begin;
    if (begin) return String(begin).slice(0, 4);
  }
  return null;
}

function extractDescription(obj) {
  let bestEn = null;
  let bestAny = null;
  walk(obj, (node) => {
    if (typeof node?.content !== "string") return;
    if (!isClassifiedAs(node, DESCRIPTION_AAT)) return;
    if (!bestEn && inLanguage(node, LANG_EN)) bestEn = node.content;
    if (!bestAny) bestAny = node.content;
  });
  return bestEn ?? bestAny;
}

function extractDimensions(obj) {
  const dims = obj?.dimension ?? [];
  return dims.map((d) => ({
    value: d?.value ?? null,
    unit:
      getNotationValue(d?.unit?.notation, "en") || d?.unit?._label || null,
    type:
      getNotationValue(d?.classified_as?.[0]?.notation, "en") ||
      d?.classified_as?.[0]?._label ||
      null,
  }));
}

function extractMedium(obj) {
  const labels = (obj?.made_of ?? [])
    .map(
      (m) =>
        getNotationValue(m?.notation, "en") ||
        getNotationValue(m?.notation, "nl") ||
        m?._label,
    )
    .filter(Boolean);
  return labels.length ? labels.join(", ") : null;
}

const IMAGE_RE = /\.(jpe?g|png|webp|tiff?)(\?|$)/i;

function imageFromRepresentations(reps) {
  for (const rep of reps ?? []) {
    const direct = getId(rep);
    if (direct && IMAGE_RE.test(direct)) return direct;
    for (const dsb of rep?.digitally_shown_by ?? []) {
      for (const ap of dsb?.access_point ?? []) {
        const url = getId(ap);
        if (url) return url;
      }
      const dsbId = getId(dsb);
      if (dsbId && IMAGE_RE.test(dsbId)) return dsbId;
    }
  }
  return null;
}

async function extractImageUrl(obj) {
  const direct = imageFromRepresentations(obj?.representation);
  if (direct) return direct;

  // Image data lives on the linked VisualItem; resolve the first one we find.
  for (const visualRef of obj?.shows ?? []) {
    const visualUrl = getId(visualRef);
    if (!visualUrl) continue;
    const visual = await resolveOne(visualUrl);
    if (!visual) continue;
    const fromVisual =
      imageFromRepresentations(visual?.representation) ||
      imageFromRepresentations([visual]);
    if (fromVisual) return fromVisual;
    for (const ap of visual?.access_point ?? []) {
      const url = getId(ap);
      if (url) return url;
    }
  }
  return null;
}

async function toCardModel(obj) {
  if (!obj) return null;
  const imageUrl = (await extractImageUrl(obj)) || PLACEHOLDER_IMAGE;
  return {
    title: extractTitle(obj) || "No title",
    author: extractCreator(obj) || "Unknown author",
    imageUrl,
    artId: idToSlug(getId(obj)),
    date: extractDate(obj) || " ",
  };
}

async function searchAndExpand(params, limit = DEFAULT_RESULT_LIMIT) {
  const items = await search(params);
  const ids = items.map(getId).filter(Boolean).slice(0, limit);
  const objects = await Promise.all(ids.map(resolveOne));
  const cards = await Promise.all(objects.map(toCardModel));
  return cards.filter(Boolean);
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
    const longTitle = extractLongTitle(raw) || title || "Untitled";
    const author = extractCreator(raw) || "Unknown author";
    const imageUrl = await extractImageUrl(raw);
    const date = extractDate(raw);
    const description = extractDescription(raw);
    const dimensions = extractDimensions(raw);
    const medium = extractMedium(raw);

    return {
      ...raw,
      longTitle,
      label: { makerLine: author },
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
