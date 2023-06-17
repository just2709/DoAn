export const searchGifs = async (query) => {
  const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=YOUR_API_KEY&q=${query}&limit=10`);
  const { data } = await response.json();
  return data.map((gif) => gif.images.downsized_medium.url);
};
