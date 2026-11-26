import { useEffect, useState } from "react";
import axios from "axios";

function Account() {
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [type, setType] = useState("shipping");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    const savedCustomer = localStorage.getItem(
      "techverse-customer"
    );

    const token = localStorage.getItem(
      "techverse-customer-token"
    );

    if (!savedCustomer || !token) {
      window.location.href = "/login";
      return;
    }

    setCustomer(JSON.parse(savedCustomer));

    loadAddresses(token);
    loadOrders(token);
  }, []);

  async function loadAddresses(token) {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/customers/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  }

  async function loadOrders(token) {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  }

  function clearAddressForm() {
    setType("shipping");
    setFirstName("");
    setLastName("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("United States");
    setIsDefault(false);
  }

  async function handleAddAddress(event) {
    event.preventDefault();

    const token = localStorage.getItem(
      "techverse-customer-token"
    );

    try {
      const response = await axios.post(
        "http://localhost:5001/api/customers/addresses",
        {
          type,
          firstName,
          lastName,
          addressLine1,
          addressLine2,
          city,
          state,
          zipCode,
          country,
          isDefault,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadAddresses(token);

      clearAddressForm();
      setShowAddressForm(false);

      alert("Address saved successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Failed to save address."
      );
    }
  }

  async function handleDeleteAddress(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem(
      "techverse-customer-token"
    );

    try {
      await axios.delete(
        `http://localhost:5001/api/customers/addresses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadAddresses(token);

      alert("Address deleted successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Failed to delete address."
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem(
      "techverse-customer-token"
    );

    localStorage.removeItem(
      "techverse-customer"
    );

    window.location.href = "/";
  }

  if (!customer) {
    return <h2>Loading...</h2>;
  }

  return (
    <section
      style={{
        color: "white",
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1>My Account</h1>

      <h2>
        Welcome back, {customer.username}!
      </h2>

      {/* Account Information */}
      <div
        style={{
          border: "1px solid gray",
          borderRadius: "10px",
          padding: "25px",
          marginTop: "30px",
        }}
      >
        <h2>Account Information</h2>

        <p>
          <strong>Username:</strong>{" "}
          {customer.username}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {customer.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {customer.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {customer.phone}
        </p>
      </div>

      {/* Addresses */}
      <div
        style={{
          border: "1px solid gray",
          borderRadius: "10px",
          padding: "25px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>My Addresses</h2>

          <button
            onClick={() =>
              setShowAddressForm(
                !showAddressForm
              )
            }
          >
            {showAddressForm
              ? "Cancel"
              : "Add Address"}
          </button>
        </div>

        {showAddressForm && (
          <form
            onSubmit={handleAddAddress}
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "25px",
            }}
          >
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="shipping">
                Shipping Address
              </option>

              <option value="billing">
                Billing Address
              </option>
            </select>

            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Address"
              value={addressLine1}
              onChange={(e) =>
                setAddressLine1(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              value={addressLine2}
              onChange={(e) =>
                setAddressLine2(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="ZIP code"
              value={zipCode}
              onChange={(e) =>
                setZipCode(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) =>
                setCountry(e.target.value)
              }
              required
            />

            <label>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) =>
                  setIsDefault(
                    e.target.checked
                  )
                }
              />

              {" "}Make this my default{" "}
              {type} address
            </label>

            <button type="submit">
              Save Address
            </button>
          </form>
        )}

        <div
          style={{
            display: "grid",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          {addresses.length === 0 ? (
            <p>
              You don't have any saved
              addresses yet.
            </p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                style={{
                  border: "1px solid gray",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <h3>
                  {address.type === "shipping"
                    ? "Shipping Address"
                    : "Billing Address"}

                  {address.isDefault &&
                    " — Default"}
                </h3>

                <p>
                  {address.firstName}{" "}
                  {address.lastName}
                </p>

                <p>
                  {address.addressLine1}
                </p>

                {address.addressLine2 && (
                  <p>
                    {address.addressLine2}
                  </p>
                )}

                <p>
                  {address.city},{" "}
                  {address.state}{" "}
                  {address.zipCode}
                </p>

                <p>
                  {address.country}
                </p>

                <button
                  onClick={() =>
                    handleDeleteAddress(
                      address.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Orders */}
      <div
        style={{
          border: "1px solid gray",
          borderRadius: "10px",
          padding: "25px",
          marginTop: "20px",
        }}
      >
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <p>
            You haven't placed any orders yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid gray",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <h3>
                    Order #{order.id}
                  </h3>

                  <strong>
                    {order.status}
                  </strong>
                </div>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>

                <div>
                  {order.items.map((item) => (
                    <p
                      key={item.id}
                    >
                      {item.product.name} ×{" "}
                      {item.quantity} — $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  ))}
                </div>

                <hr />

                <p>
                  <strong>Subtotal:</strong>{" "}
                  ${order.subtotal.toFixed(2)}
                </p>

                <p>
                  <strong>Shipping:</strong>{" "}
                  {order.shippingCost === 0
                    ? "FREE"
                    : `$${order.shippingCost.toFixed(
                        2
                      )}`}
                </p>

                <p>
                  <strong>Tax:</strong>{" "}
                  ${order.tax.toFixed(2)}
                </p>

                <h3>
                  Total: $
                  {order.total.toFixed(2)}
                </h3>

                <div>
                  <strong>
                    Shipping to:
                  </strong>

                  <p>
                    {order.shippingFirstName}{" "}
                    {order.shippingLastName}
                  </p>

                  <p>
                    {order.shippingAddress}
                  </p>

                  {order.shippingAddress2 && (
                    <p>
                      {order.shippingAddress2}
                    </p>
                  )}

                  <p>
                    {order.shippingCity},{" "}
                    {order.shippingState}{" "}
                    {order.shippingZipCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Buttons */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() =>
            (window.location.href = "/")
          }
        >
          Continue Shopping
        </button>

        <button onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </section>
  );
}

export default Account;