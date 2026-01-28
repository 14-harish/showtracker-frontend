import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function PosterModal({ item, onClose, onLocalUpdate }) {
  const [details, setDetails] = useState(null);
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch details
  useEffect(() => {
    const endpoint =
      item.media_type === "movie"
        ? `/tmdb/movie/${item.id}`
        : `/tmdb/tv/${item.id}`;

    apiFetch(endpoint)
      .then(setDetails)
      .catch(() =>
        setDetails({
          title: item.title || item.name,
          name: item.name,
          overview: "Details unavailable.",
          poster_path: item.poster_path,
          release_year: null,
          first_air_year: null,
        })
      )
      .finally(() => setLoading(false));
  }, [item]);

  // ESC to close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  // -------- MOVIES --------
  async function saveMovie(status) {
    if (!details) return;
    setSaving(true);

    await apiFetch("/movies/save", {
      method: "POST",
      body: JSON.stringify({
        tmdb_movie_id: item.id,
        title: details.title,
        release_year: details.release_year,
        poster_path: details.poster_path,
        status,
      }),
    });

    // ✅ SAFE call
    onLocalUpdate?.({
      media_type: "movie",
      id: item.id,
      newStatus: status,
    });

    setSaving(false);
    onClose();
  }

  async function removeMovie() {
    setSaving(true);
    await apiFetch(`/movies/${item.id}`, { method: "DELETE" });

    onLocalUpdate?.({
      media_type: "movie",
      id: item.id,
      newStatus: null,
    });

    setSaving(false);
    onClose();
  }

  // -------- TV SHOWS --------
  async function saveTV(status, s = null, e = null) {
    if (!details) return;
    setSaving(true);

    await apiFetch("/tv/save", {
      method: "POST",
      body: JSON.stringify({
        tmdb_tv_id: item.id,
        name: details.name,
        first_air_year: details.first_air_year,
        poster_path: details.poster_path,
        status,
        current_season: s,
        current_episode: e,
      }),
    });

    onLocalUpdate?.({
      media_type: "tv",
      id: item.id,
      newStatus: status,
    });

    setSaving(false);
    onClose();
  }

  async function removeTV() {
    setSaving(true);
    await apiFetch(`/tv/${item.id}`, { method: "DELETE" });

    onLocalUpdate?.({
      media_type: "tv",
      id: item.id,
      newStatus: null,
    });

    setSaving(false);
    onClose();
  }

  // -------- LOADING --------
  if (loading || !details) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // -------- UI --------
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-zinc-700 rounded-xl max-w-4xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          {/* POSTER */}
          {details.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt=""
              className="md:w-72 object-cover"
            />
          )}

          {/* CONTENT */}
          <div className="p-6 flex-1 text-white">
            <p className="text-xs uppercase text-gray-400 mb-1">
              {item.media_type === "movie" ? "Movie" : "TV Series"}
            </p>

            <h2 className="text-3xl font-bold mb-3">
              {details.title || details.name}
            </h2>

            <p className="text-gray-400 mb-6">
              {details.overview}
            </p>

            {/* 🎬 MOVIES */}
            {item.media_type === "movie" && (
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={saving}
                  onClick={() => saveMovie("watchlist")}
                  className="px-5 py-2 bg-white text-black rounded font-semibold"
                >
                  Watchlist
                </button>

                <button
                  disabled={saving}
                  onClick={() => saveMovie("completed")}
                  className="px-5 py-2 border border-zinc-600 rounded"
                >
                  Completed
                </button>

                <button
                  disabled={saving}
                  onClick={removeMovie}
                  className="px-5 py-2 text-red-400 border border-red-500/30 rounded"
                >
                  Remove
                </button>
              </div>
            )}

            {/* 📺 TV */}
            {item.media_type === "tv" && (
              <>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    disabled={saving}
                    onClick={() => saveTV("watchlist")}
                    className="px-5 py-2 bg-white text-black rounded font-semibold"
                  >
                    Watchlist
                  </button>

                  <button
                    disabled={saving}
                    onClick={() => saveTV("completed")}
                    className="px-5 py-2 border border-zinc-600 rounded"
                  >
                    Completed
                  </button>

                  <button
                    disabled={saving}
                    onClick={removeTV}
                    className="px-5 py-2 text-red-400 border border-red-500/30 rounded"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex gap-3">
                  <input
                    placeholder="Season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-20 px-3 py-2 bg-black border border-zinc-700 rounded"
                  />
                  <input
                    placeholder="Episode"
                    value={episode}
                    onChange={(e) => setEpisode(e.target.value)}
                    className="w-20 px-3 py-2 bg-black border border-zinc-700 rounded"
                  />
                  <button
                    disabled={!season || !episode || saving}
                    onClick={() =>
                      saveTV("watching", Number(season), Number(episode))
                    }
                    className="px-4 py-2 border border-zinc-600 rounded"
                  >
                    Watching
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
