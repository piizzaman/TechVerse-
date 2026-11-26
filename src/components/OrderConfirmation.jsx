import { Link } from "react-router-dom";
function OrderConfirmation({ goHome }) {
  let order = null;
  try { order = JSON.parse(localStorage.getItem("techverse-last-demo-order") || "null"); } catch { order = null; }
  return <main className="confirmation-page"><div className="confirmation-mark">✓</div><p className="eyebrow">DEMO ORDER COMPLETE</p><h1>Thanks for trying TechVerse.</h1><p>Your sample order has been created locally for this demo. No payment was collected and no shipment will be made.</p>{order && <div className="confirmation-receipt"><span>REFERENCE</span><strong>{order.reference}</strong><span>ORDER TOTAL</span><strong>${order.total}</strong><small>{new Date(order.createdAt).toLocaleString()}</small></div>}<Link className="shop-btn" to="/">Continue exploring</Link></main>;
}
export default OrderConfirmation;
