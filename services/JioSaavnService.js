import axios from "axios";

// JioSaavn unofficial API endpoints
const JIOSAAVN_BASE_URL = "https://www.jiosaavn.com/api.php";

export const getJioSaavnSongs = async (query) => {
  try {
    const response = await axios.get(JIOSAAVN_BASE_URL, {
      params: {
        __call: "autocomplete.get",
        _format: "json",
        _marker: "0",
        cc: "in",
        includeMetaTags: "1",
        query: query
      }
    });

    // JioSaavn returns songs in the 'songs' array
    const songs = response.data.songs?.data || [];

    return songs.slice(0, 10).map(song => {
      // Convert duration from seconds to MM:SS format
      const durationSeconds = parseInt(song.duration) || 0;
      const minutes = Math.floor(durationSeconds / 60);
      const seconds = durationSeconds % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      return {
        id: song.id,
        title: song.title || song.song,
        artist: song.more_info?.artistMap?.primary_artists?.map(a => a.name).join(", ") 
                || song.more_info?.singers 
                || song.subtitle 
                || "Unknown Artist",
        platform: "jiosaavn",
        duration: formattedDuration,
        thumbnail: song.image?.replace("150x150", "500x500") || song.image,
        url: song.perma_url || `https://www.jiosaavn.com/song/${song.id}`,
        createdAt: new Date()
      };
    });
  } catch (err) {
    console.error("JioSaavn API Error:", err.message);
    return [];
  }
};

// Alternative method using search endpoint
export const searchJioSaavnSongs = async (query) => {
  try {
    const response = await axios.get(JIOSAAVN_BASE_URL, {
      params: {
        __call: "search.getResults",
        _format: "json",
        _marker: "0",
        api_version: "4",
        ctx: "web6dot0",
        n: "10",
        p: "1",
        q: query
      }
    });

    const results = response.data.results || [];
    
    return results.map(song => {
      const durationSeconds = parseInt(song.duration) || 0;
      const minutes = Math.floor(durationSeconds / 60);
      const seconds = durationSeconds % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      return {
        id: song.id,
        title: song.title,
        artist: song.more_info?.artistMap?.primary_artists?.map(a => a.name).join(", ") 
                || song.more_info?.singers 
                || song.subtitle 
                || "Unknown Artist",
        platform: "jiosaavn",
        duration: formattedDuration,
        thumbnail: song.image?.replace("150x150", "500x500") || song.image,
        url: song.perma_url,
        createdAt: new Date()
      };
    });
  } catch (err) {
    console.error("JioSaavn Search Error:", err.message);
    return [];
  }
};