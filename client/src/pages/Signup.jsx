import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!API_URL) {
      setError("API URL is not configured ❌");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!form.password) {
      setError("Please enter your password");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const signupURL =
        `${API_URL}/api/auth/signup`;

      console.log(
        "Signup URL:",
        signupURL
      );

      const response = await fetch(
        signupURL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email
              .trim()
              .toLowerCase(),
            password: form.password,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Signup Status:",
        response.status
      );

      console.log(
        "Signup Response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Signup failed"
        );
        return;
      }

      setSuccess(
        "Account created successfully! 🎉"
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      setError(
        "Unable to connect to server ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-left">

          <div className="auth-brand">
            🌙 AstroGuru AI
          </div>

          <h1>
            Start Your
            <br />
            <span>
              Astrology Journey
            </span>
          </h1>

          <p>
            Create your account and
            discover personalized
            AI-powered astrology
            guidance.
          </p>

        </div>

        <div className="auth-card">

          <div className="auth-header">

            <h2>
              Create Account
            </h2>

            <p>
              Join AstroGuru AI today
            </p>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSignup}
          >

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
                disabled={loading}
                required
              />

            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-footer">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;