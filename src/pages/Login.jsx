import { useState } from "react";
import axios from "axios";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      console.log("Sending customer login request...");

      const response = await axios.post(
        "http://localhost:5001/api/customers/login",
        {
          login,
          password,
        }
      );

      console.log("Login response:", response.data);

      localStorage.setItem(
        "techverse-customer-token",
        response.data.token
      );

      localStorage.setItem(
        "techverse-customer",
        JSON.stringify(response.data.customer)
      );

      alert("Login successful!");

      window.location.href = "/account";
    } catch (error) {
      console.error("CUSTOMER LOGIN ERROR:", error);

      if (error.response) {
        alert(
          `Login failed: ${error.response.status} - ${
            error.response.data?.error ||
            "Unknown server error"
          }`
        );
      } else if (error.request) {
        alert(
          "Login failed: The request was sent, but the backend did not respond."
        );
      } else {
        alert(
          `Login failed: ${error.message}`
        );
      }
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
      <h1>Customer Login</h1>

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
          placeholder="Username or email"
          value={login}
          onChange={(e) =>
            setLogin(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?
      </p>

      <button
        onClick={() =>
          (window.location.href = "/register")
        }
      >
        Create Account
      </button>
    </section>
  );
}

export default Login;