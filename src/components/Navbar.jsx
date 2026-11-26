import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar({ cartCount, search, setSearch }) {
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <Link className="logo" to="/" aria-label="TechVerse home">
        <span className="logo-mark">T</span><span className="logo-text">TechVerse<span>.</span></span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <a href="/#products">Shop</a>
        <Link to="/account">Account</Link>
      </nav>
      <label className="search-bar">
        <span className="sr-only">Search products</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
      </label>
      <div className="navbar-actions">
        <button className="login-link" onClick={() => navigate("/login")}>Sign in</button>
        <button className="cart-btn" onClick={() => navigate("/cart")}>Cart <span>{cartCount}</span></button>
      </div>
    </header>
  );
}
export default Navbar;
