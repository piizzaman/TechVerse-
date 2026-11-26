import { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [address, setAddress] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/customers/register",
        {
          username,
          name,
          email,
          phone,
          password,
          address,
        }
      );

      alert("Account created successfully!");

      window.location.href = "/login";
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Failed to create account."
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
      <h1>Create Your TechVerse Account</h1>

      <form
        onSubmit={handleRegister}
        style={{
          display: "grid",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
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
          minLength="8"
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          minLength="8"
          required
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />

        <button type="submit">
          Create Account
        </button>
      </form>
    </section>
  );
}

export default Register;