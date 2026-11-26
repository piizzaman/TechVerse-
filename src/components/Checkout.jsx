import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout({ placeOrder, name, setName, email, setEmail, address, setAddress }) {
  const { cart, total } = useCart();
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  if (!cart.length) return <main className="checkout-page"><h1>Your cart is empty</h1><Link to="/">Continue shopping</Link></main>;
  return (
    <main className="checkout-page">
      <div className="checkout-heading"><p className="eyebrow">DEMO CHECKOUT</p><h1>Almost yours.</h1><p>This portfolio demo does not collect or process real payment details.</p></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
          <h2>Contact & delivery</h2>
          <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label>Street address<input value={address} onChange={(e) => setAddress(e.target.value)} required autoComplete="street-address" /></label>
          <div className="checkout-fields"><label>City<input value={city} onChange={(e) => setCity(e.target.value)} required autoComplete="address-level2" /></label><label>ZIP code<input value={zip} onChange={(e) => setZip(e.target.value)} required autoComplete="postal-code" /></label></div>
          <div className="demo-notice"><strong>Demo mode</strong><span>Click “Place demo order” to simulate an order confirmation. No charge will be made.</span></div>
          <button className="place-order-button" type="submit">Place demo order · ${total}</button>
          <Link className="back-to-cart" to="/cart">← Back to cart</Link>
        </form>
        <aside className="checkout-summary"><h2>Order summary</h2>{cart.map((item) => <div className="summary-item" key={item.id}><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>Qty {item.quantity}</small></div><b>${(Number(item.price) * item.quantity).toFixed(2)}</b></div>)}<div className="summary-total"><span>Total</span><strong>${total}</strong></div></aside>
      </div>
    </main>
  );
}
export default Checkout;
