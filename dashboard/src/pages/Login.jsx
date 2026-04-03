import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://digigrowth.digital/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // 🔐 SAVE AUTH
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("clientId", data.clientId || "");

      // 🚀 ROLE BASED REDIRECT

      if (data.role === "admin") {
        navigate("/admin/overview");

      } else if (data.role === "client") {
        navigate(`/dashboard/${data.clientId}/overview`);

      } else if (data.role === "team") {
        navigate(`/team/${data.clientId}/dashboard`);

      } else {
        setError("Invalid role assigned");
      }

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h4 className="mb-3">Login</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              name="email"
              required
              onChange={handleChange}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              name="password"
              required
              onChange={handleChange}
            />

            <button className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;