const language = "en"; //futuro: añadir opcion cambiar idioma (solo en/nl)
const API_KEY = import.meta.env.VITE_API_KEY;
const URL_API = `https://www.rijksmuseum.nl/api/${language}/collection?key=${API_KEY}`;

export async function getByName(queryName) {
  try {
    const response = await fetch(`${URL_API}&q=${queryName}`);
    const data = await response.json();
    console.log(data);

    return data.artObjects.map((artObject) => ({
      title: artObject.title || "No title",
      author: artObject.principalOrFirstMaker || "Unknown author",
      imageUrl: artObject.webImage ? artObject.webImage.url : "/noimage.png",
      artId: artObject.objectNumber || "No id found",
      date: artObject.dating?.sortingDate || " ",
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function getById(id) {
  try {
    const URL_COLLECTION = `https://www.rijksmuseum.nl/api/${language}/collection/${id}?key=${API_KEY}`;
    const response = await fetch(URL_COLLECTION);
    const data = await response.json();

    return data.artObject || null;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

export async function getByMaker(queryMaker) {
  try {
    const response = await fetch(`${URL_API}&involvedMaker=${queryMaker}`);
    const art = await response.json();
    console.log(art);
    return art;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
