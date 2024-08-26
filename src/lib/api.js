const language = "en";
const API_KEY = import.meta.env.VITE_API_KEY;
const URL_API = `https://www.rijksmuseum.nl/api/${language}/collection?key=${API_KEY}`;

export async function getByName(queryName) {
  const response = await fetch(`${URL_API}&q=${queryName}`);
  const data = await response.json();
  const artObject = data.artObjects[0];

  return {
    title: artObject.title,
    author: artObject.principalOrFirstMaker,
    longTitle: artObject.longTitle,
    imageUrl: artObject.webImage.url,
  };
}

export async function getByMaker(queryMaker) {
  const data = await fetch(`${URL_API}&involvedMaker=${queryMaker}`);
  const art = await data.json();
  console.log(art);
  return art;
}
