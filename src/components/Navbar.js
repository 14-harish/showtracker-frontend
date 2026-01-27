export default function Navbar({ page, setPage, onLogout }) {
  return (
    <nav className="flex items-center gap-6 px-8 py-4 bg-gray-900 border-b border-gray-800">
      <h1
        className="text-xl font-bold tracking-wide cursor-pointer"
        onClick={() => setPage("home")}
      >
        ShowTracker
      </h1>

      <button
        className={`hover:text-white ${
          page === "home" ? "text-white" : "text-gray-400"
        }`}
        onClick={() => setPage("home")}
      >
        Home
      </button>

      <button
        className={`hover:text-white ${
          page === "movies" ? "text-white" : "text-gray-400"
        }`}
        onClick={() => setPage("movies")}
      >
        Movies
      </button>

      <button
        className={`hover:text-white ${
          page === "tv" ? "text-white" : "text-gray-400"
        }`}
        onClick={() => setPage("tv")}
      >
        TV Shows
      </button>

      <button
        className="ml-auto text-gray-400 hover:text-red-400"
        onClick={onLogout}
      >
        Logout
      </button>
    </nav>
  );
}
