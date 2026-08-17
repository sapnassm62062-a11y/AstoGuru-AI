import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const loginURL = `${API_URL}/api/auth/login`;

      console.log("Login URL:", loginURL);

      const response = await fetch(loginURL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      console.log("Login Status:", response.status);

      const contentType = response.headers.get("content-type");

      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error("Server returned:", text);

        throw new Error(
          `Server returned ${response.status}. Please check API route.`
        );
      }

      console.log("Login Response:", data);

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      alert("Login Successful 🌙");

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.message ||
          "Server not connected ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>
          🌙 AstroGuru AI
        </h1>

        <h2>
          Welcome Back
        </h2>

        <p>
          Login to explore your cosmic guidance
        </p>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login 🌙"}
          </button>

        </form>

        <p className="switch-text">

          New user?

          <span
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer" }}
          >
            Create Account
          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;