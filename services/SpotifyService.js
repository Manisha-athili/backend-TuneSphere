import axios from "axios";
import qs from "qs";

let SPOTIFY_TOKEN = null;
let SPOTIFY_TOKEN_EXPIRES = 0;

const getSpotifyToken = async () => {
  if (SPOTIFY_TOKEN && Date.now() < SPOTIFY_TOKEN_EXPIRES) return SPOTIFY_TOKEN;

  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")
      }
    }
  );

  SPOTIFY_TOKEN = tokenResponse.data.access_token;
  SPOTIFY_TOKEN_EXPIRES = Date.now() + tokenResponse.data.expires_in * 1000;
  return SPOTIFY_TOKEN;
};

export const getSpotifySongs = async (query) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: "track", limit: 10 }
    });

    return response.data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      platform: "spotify",
      duration: `${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000)}`,
      thumbnail: track.album.images[0]?.url,
      url: track.external_urls.spotify
    }));
  } catch (err) {
    console.error("Spotify API Error:", err);
    return [];
  }
};
