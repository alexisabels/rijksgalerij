const language = "en";
const URL_API = `https://www.rijksmuseum.nl/api/${language}/collection?key=hzmILNcD`;

export async function getByName(queryName) {
  const response = await fetch(`${URL_API}&q=${queryName}`);

  const data = await response.json();

  const artObject = data.artObjects[0];

  const title = artObject.title;
  const author = artObject.principalOrFirstMaker;
  const imageUrl = artObject.webImage.url;

  document.getElementById("artName").textContent = title;
  document.getElementById("author").textContent = author;
  document.getElementById("imgcard").src = imageUrl;

  return {
    title: title,
    author: author,
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
