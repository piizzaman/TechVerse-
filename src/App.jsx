import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Account from "./pages/Account";

function App() {
  const { cart, clearCart } = useCart();
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const isAdminLoggedIn = Boolean(localStorage.getItem("techverse-admin-token"));

  function placeOrder() {
    if (!name.trim() || !email.trim() || !address.trim()) return;
    const order = {
      reference: `TV-${Date.now().toString().slice(-8)}`,
      name, email, address,
      items: cart.map(({ id, name: productName, price, quantity }) => ({ id, name: productName, price: Number(price), quantity })),
      total: cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2),
      createdAt: new Date().toISOString(),
      mode: "Demo order — no payment processed",
    };
    localStorage.setItem("techverse-last-demo-order", JSON.stringify(order));
    clearCart();
    window.location.assign("/confirmation");
  }

  return <>
    <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} search={search} setSearch={setSearch} />
    <Routes>
      <Route path="/" element={<><Hero /><ProductGrid search={search} /></>} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout placeOrder={placeOrder} name={name} setName={setName} email={email} setEmail={setEmail} address={address} setAddress={setAddress} />} />
      <Route path="/confirmation" element={<OrderConfirmation goHome={() => window.location.assign("/")} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={isAdminLoggedIn ? <Admin /> : <Navigate to="/admin-login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <footer className="site-footer"><span>TECHVERSE<span className="footer-dot">.</span></span><small>Portfolio demonstration · No real purchases are processed</small></footer>
  </>;
}
export default App;
