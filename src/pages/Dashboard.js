import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

import PosterRow from "../components/PosterRow";
import PosterCard from "../components/PosterCard";
import PosterModal from "../components/PosterModal";

export default function Dashboard({ refreshKey }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    apiFetch("/dashboard/")
      .then(setData)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  function handleLocalUpdate({ media_type, id, newStatus }) {
    setData((prev) => {
      if (!prev) return prev;

      const clone = structuredClone(prev);

      if (media_type === "movie") {
        const all = [
          ...clone.movies.watchlist,
          ...clone.movies.completed,
        ];

        const item = all.find((m) => m.tmdb_movie_id === id);
        clone.movies.watchlist = clone.movies.watchlist.filter(m => m.tmdb_movie_id !== id);
        clone.movies.completed = clone.movies.completed.filter(m => m.tmdb_movie_id !== id);

        if (newStatus === "watchlist") clone.movies.watchlist.push(item);
        if (newStatus === "completed") clone.movies.completed.push(item);
      }

      if (media_type === "tv") {
        const all = [
          ...clone.tv.watchlist,
          ...clone.tv.watching,
          ...clone.tv.completed,
        ];

        const item = all.find((t) => t.tmdb_tv_id === id);
        clone.tv.watchlist = clone.tv.watchlist.filter(t => t.tmdb_tv_id !== id);
        clone.tv.watching = clone.tv.watching.filter(t => t.tmdb_tv_id !== id);
        clone.tv.completed = clone.tv.completed.filter(t => t.tmdb_tv_id !== id);

        if (newStatus === "watchlist") clone.tv.watchlist.push(item);
        if (newStatus === "watching") clone.tv.watching.push(item);
        if (newStatus === "completed") clone.tv.completed.push(item);
      }

      return clone;
    });
  }

  if (loading || !data) {
    return (
      <div className="flex justify-center mt-32 text-gray-400">
        Loading your library…
      </div>
    );
  }

  return (
    <div className="space-y-20">

      {/* 🎬 MOVIES */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Movies</h2>

        <PosterRow
          title="Watchlist"
          items={data.movies.watchlist}
          renderItem={(m) => (
            <PosterCard
              key={m.tmdb_movie_id}
              title={m.title}
              posterPath={m.poster_path}
              onClick={() =>
                setSelectedItem({
                  media_type: "movie",
                  id: m.tmdb_movie_id,
                  title: m.title,
                  poster_path: m.poster_path,
                  currentStatus: "watchlist",
                })
              }
            />
          )}
        />

        <PosterRow
          title="Completed"
          items={data.movies.completed}
          renderItem={(m) => (
            <PosterCard
              key={m.tmdb_movie_id}
              title={m.title}
              posterPath={m.poster_path}
              onClick={() =>
                setSelectedItem({
                  media_type: "movie",
                  id: m.tmdb_movie_id,
                  title: m.title,
                  poster_path: m.poster_path,
                  currentStatus: "completed",
                })
              }
            />
          )}
        />
      </section>

      {/* 📺 TV */}
      <section>
        <h2 className="text-3xl font-bold mb-8">TV Shows</h2>

        {["watchlist", "watching", "completed"].map((status) => (
          <PosterRow
            key={status}
            title={status.replace(/^\w/, c => c.toUpperCase())}
            items={data.tv[status]}
            renderItem={(tv) => (
              <PosterCard
                key={tv.tmdb_tv_id}
                title={tv.name}
                posterPath={tv.poster_path}
                badge={
                  status === "watching"
                    ? `S${tv.current_season}E${tv.current_episode}`
                    : undefined
                }
                onClick={() =>
                  setSelectedItem({
                    media_type: "tv",
                    id: tv.tmdb_tv_id,
                    name: tv.name,
                    poster_path: tv.poster_path,
                    currentStatus: status,
                  })
                }
              />
            )}
          />
        ))}
      </section>

      {selectedItem && (
        <PosterModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onLocalUpdate={handleLocalUpdate}
        />
      )}
    </div>
  );
}