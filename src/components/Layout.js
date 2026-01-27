export default function Layout({ children, onNavigate, onLogout, page }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO */}
      <button
        onClick={() => onNavigate("home")}
        className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition"
      >
        Show<span className="text-gray-300">Tracker</span>
      </button>

          {/* NAV ACTIONS */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate("home")}
              className={`text-sm font-medium transition
                ${
                  page === "home"
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onNavigate("search")}
              className={`text-sm font-medium transition
                ${
                  page === "search"
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              Search
            </button>

            <div className="w-px h-6 bg-zinc-700" />

            <button
              onClick={onLogout}
              className="text-sm font-medium text-gray-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}