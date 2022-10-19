export const getVideos = async (searchQuery) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  // https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=disney%20trailer&key=[YOUR_A

  try {
    const response = await fetch(` 
  https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${YOUTUBE_API_KEY}

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
