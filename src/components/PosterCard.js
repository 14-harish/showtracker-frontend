export default function PosterCard({
  title,
  posterPath,
  badge,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="w-36 sm:w-40 flex-shrink-0 cursor-pointer group"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
        {posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${posterPath}`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Badge */}
        {badge && (
          <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-xs rounded text-white">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-center text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
        {title}
      </p>
    </div>
  );
}