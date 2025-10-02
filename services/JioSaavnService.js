import axios from "axios";

export const getJioSaavnSongs = async (query) => {
  try {
    const response = await axios.get("https://www.saavn.com/api.php", {
      params: {
        __call: "search.getResults",
        _format: "json",
        query
      }
    });

    if (!response.data.songs) return [];

    return response.data.songs.map(song => ({
      id: song.id,
      title: song.name,
      artist: song.singers,
      platform: "JioSaavn",
      duration: song.duration, // format: mm:ss
      thumbnail: song.image,
      url: song.perma_url
    }));
  } catch (err) {
    console.error("JioSaavn API Error:", err);
    return [];
  }
};
 