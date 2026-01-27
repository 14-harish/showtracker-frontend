import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Layout from "./components/Layout";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("home");
  const [refreshKey, setRefreshKey] = useState(0);

  function logout() {
    localStorage.clear();
    setLoggedIn(false);
    setPage("home");
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Layout
  page={page}
  onNavigate={setPage}
  onLogout={logout}
>
      {page === "home" && <Dashboard refreshKey={refreshKey} />}
      {page === "search" && (
        <Search onSaved={() => setRefreshKey(k => k + 1)} />
      )}
    </Layout>
  );
}

export default App;