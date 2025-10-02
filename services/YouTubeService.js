import axios from "axios";

export const getYouTubeSongs = async (query) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          q: query,
          part: "snippet",
          type: "video",
          maxResults: 10
        }
      }
    );

    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      platform: "YouTube",
      duration: "Unknown", // Can fetch via separate API call to videos endpoint
      thumbnail: item.snippet.thumbnails.default.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (err) {
    console.error("YouTube API Error:", err);
    return [];
  }
};
