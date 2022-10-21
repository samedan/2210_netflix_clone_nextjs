export const getCommonVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  // https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=disney%20trailer&key=[YOUR_A

  try {
    const BASE_URL = "https://youtube.googleapis.com/youtube/v3";

    const response = await fetch(` 
        ${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}
  `);
    const data = await response.json();

    if (data?.error) {
      console.error("Youtube API Error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      // fix possible error
      const id = item.id?.videoId || item.id;
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: id,
      };
    });
  } catch (error) {
    console.error("Video library error", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  // videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=RO
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=25&chart=mostPopular&regionCode=RO";
  return getCommonVideos(URL);
};
