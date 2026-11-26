import { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "techverse-admin-token",
        response.data.token
      );

      alert("Admin login successful!");

      window.location.href = "/admin";
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Admin login failed."
      );
    }
  }

  return (
    <section
      style={{
        color: "white",
        padding: "60px 20px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h1>TechVerse Admin Login</h1>

      <form
        onSubmit={handleLogin}
        style={{
          display: "grid",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Admin username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Admin Login
        </button>
      </form>
    </section>
  );
}

export default AdminLogin;