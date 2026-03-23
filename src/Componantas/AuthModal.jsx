// src/Componantas/AuthModal.jsx
import { useState } from "react";
import { buildApiUrl, setToken } from "../auth";
import { IoIosArrowBack } from "react-icons/io";

const AuthModal = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState("login"); // or 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(buildApiUrl(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Debug: log where the request went and the status
      console.debug("Auth response:", res.url, res.status);

      // Safely get response body text and try parse to JSON
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.warn("Auth response not JSON:", text);
      }

      if (!res.ok) {
        // Prefer backend-provided error message, otherwise show status
        const message =
          data?.error ||
          (res.status === 404
            ? "Auth API not found. Make sure the backend server is running on port 5001."
            : `Authentication failed (${res.status})`);
        setError(message);
        setLoading(false);
        return;
      }

      // expected successful response with { token, user }
      if (!data || !data.token) {
        setError("Authentication succeeded but no token received.");
        setLoading(false);
        return;
      }

      // save token + user
      setToken(data.token, data.user);
      setLoading(false);
      if (typeof onSuccess === "function") onSuccess(data.user);
    } catch (err) {
      console.error("Auth error:", err);
      setError("Could not reach the auth server. Make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        <button
          aria-label="Close auth"
          onClick={onCancel}
          style={{ cursor: "pointer" }}
        >
          <IoIosArrowBack title="Back to quote" />
        </button>
      </div>

      <form onSubmit={submit} style={{ marginTop: "1rem" }}>
        {mode === "register" && (
          <div className="mb-2">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Working..." : mode === "login" ? "Login" : "Register"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create account" : "Have account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthModal;
