import { useState } from "react";
import { apiFetch } from "../api/client";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Signup first (if needed)
      if (mode === "signup") {
        await apiFetch("/users/", {
          method: "POST",
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });
      }

      // 🔹 Login (common for both)
      const data = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.access_token);
      onLogin();
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {/* subtle background fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-900/70" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[420px] bg-zinc-900/95 backdrop-blur
                   px-8 py-10 rounded-lg border border-zinc-800
                   shadow-2xl shadow-black/60"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-2">
          ShowTracker
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Track movies & TV shows you love
        </p>

        {/* Username (signup only) */}
        {mode === "signup" && (
          <input
            className="w-full mb-4 px-4 py-3 bg-black border border-zinc-700
                       rounded-md outline-none focus:border-gray-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        {/* Email */}
        <input
          className="w-full mb-4 px-4 py-3 bg-black border border-zinc-700
                     rounded-md outline-none focus:border-gray-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          className="w-full mb-6 px-4 py-3 bg-black border border-zinc-700
                     rounded-md outline-none focus:border-gray-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-md
                     font-semibold text-base transition
                     hover:bg-gray-200 active:scale-[0.98]
                     disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        {/* Toggle */}
        <p className="mt-6 text-sm text-center text-gray-400">
          {mode === "login" ? (
            <>
              New to ShowTracker?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-white underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-white underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}