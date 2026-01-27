import { useState } from "react";
import { apiFetch } from "../api/client";
import PosterModal from "../components/PosterModal";

export default function Search({ onSaved }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setSearched(true);

    try {
      let data = [];

      if (type === "movie" || type === "all") {
        const params = new URLSearchParams({
          query,
          ...(year && { year }),
        });

        const m = await apiFetch(`/tmdb/search/movie?${params.toString()}`);
        data.push(
          ...m.results.map((x) => ({
            media_type: "movie",
            id: x.tmdb_movie_id,
            title: x.title,
            poster_path: x.poster_path,
            release_year: x.release_year,
          }))
        );
      }

      if (type === "tv" || type === "all") {
        const params = new URLSearchParams({
          query,
          ...(year && { year }),
        });

        const t = await apiFetch(`/tmdb/search/tv?${params.toString()}`);
        data.push(
          ...t.results.map((x) => ({
            media_type: "tv",
            id: x.tmdb_tv_id,
            name: x.name,
            poster_path: x.poster_path,
            first_air_year: x.first_air_year,
          }))
        );
      }

      setResults(data);
    } catch {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white space-y-10 animate-fade-in">
      {/* 🔍 SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 max-w-5xl mx-auto"
      >
        {/* Query */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV shows…"
          className="flex-1 px-4 py-3 rounded bg-zinc-900 border border-zinc-700 outline-none
                     placeholder:text-gray-500 focus:border-zinc-500 transition"
        />

        {/* Year */}
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-28 px-4 py-3 rounded bg-zinc-900 border border-zinc-700 outline-none
                     placeholder:text-gray-500 focus:border-zinc-500 transition"
        />

        {/* Type (FIXED SELECT) */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 rounded bg-zinc-900 border border-zinc-700
                       text-white cursor-pointer outline-none
                       focus:border-zinc-500 transition"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>

          {/* Custom arrow */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="px-8 py-3 bg-white text-black rounded font-semibold
                     hover:bg-gray-200 transition"
        >
          Search
        </button>
      </form>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* ❌ NO RESULTS */}
      {!loading && searched && results.length === 0 && (
        <p className="text-center text-gray-400">
          No results found
        </p>
      )}

      {/* 🎬 RESULTS GRID */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item) => (
            <div
              key={`${item.media_type}-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="cursor-pointer hover:scale-105 transition"
            >
              <div className="aspect-[2/3] bg-zinc-800 rounded overflow-hidden">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <p className="mt-2 text-sm text-center text-gray-300 line-clamp-2">
                {item.title || item.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 🎥 MODAL */}
      {selectedItem && (
        <PosterModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}