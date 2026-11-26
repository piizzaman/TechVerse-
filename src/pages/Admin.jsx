import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/admin.css";

const API_URL = "http://localhost:5001/api";

const emptyProduct = {
  name: "",
  price: "",
  stock: "",
  image: "",
  category: "",
  description: "",
};

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [productForm, setProductForm] =
    useState(emptyProduct);

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [savingProduct, setSavingProduct] =
    useState(false);

  const token = localStorage.getItem(
    "techverse-admin-token"
  );

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin-login";
      return;
    }

    loadOrders();
    loadProducts();
  }, []);

  async function loadOrders() {
    try {
      const response = await axios.get(
        `${API_URL}/orders/admin`,
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
        return;
      }

      alert(
        error.response?.data?.error ||
          "Failed to load orders."
      );
    } finally {
      setLoadingOrders(false);
    }
  }

  async function loadProducts() {
    try {
      const response = await axios.get(
        `${API_URL}/products`
      );

      setProducts(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Failed to load products."
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  function handleProductChange(event) {
    const { name, value } = event.target;

    setProductForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEditing(product) {
    setEditingProductId(product.id);

    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: product.category,
      description: product.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingProductId(null);
    setProductForm(emptyProduct);
  }

  async function saveProduct(event) {
    event.preventDefault();

    if (
      !productForm.name ||
      productForm.price === "" ||
      productForm.stock === "" ||
      !productForm.image ||
      !productForm.category ||
      !productForm.description
    ) {
      alert("Please fill out every product field.");
      return;
    }

    try {
      setSavingProduct(true);

      if (editingProductId) {
        const response = await axios.put(
          `${API_URL}/products/${editingProductId}`,
          {
            name: productForm.name,
            price: Number(productForm.price),
            stock: Number(productForm.stock),
            image: productForm.image,
            category: productForm.category,
            description: productForm.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts((current) =>
          current.map((product) =>
            product.id === editingProductId
              ? response.data
              : product
          )
        );

        alert("Product updated successfully.");
      } else {
        const response = await axios.post(
          `${API_URL}/products`,
          {
            name: productForm.name,
            price: Number(productForm.price),
            stock: Number(productForm.stock),
            image: productForm.image,
            category: productForm.category,
            description: productForm.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts((current) => [
          ...current,
          response.data,
        ]);

        alert("Product created successfully.");
      }

      cancelEditing();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      alert(
        error.response?.data?.error ||
          "Failed to save product."
      );
    } finally {
      setSavingProduct(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/products/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );

      if (editingProductId === product.id) {
        cancelEditing();
      }

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      alert(
        error.response?.data?.error ||
          "Failed to delete product."
      );
    }
  }

  async function updateOrderStatus(
    orderId,
    status
  ) {
    try {
      await axios.patch(
        `${API_URL}/orders/admin/${orderId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      alert(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      alert(
        error.response?.data?.error ||
          "Failed to update order."
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem(
      "techverse-admin-token"
    );

    window.location.href = "/admin-login";
  }

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* Header */}

        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">
              SMOKESHIELD
            </p>

            <h1>Admin Dashboard</h1>

            <p className="admin-subtitle">
              Manage products, inventory, and
              customer orders.
            </p>
          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Admin Logout
          </button>
        </header>

        {/* Dashboard Stats */}

        <section className="admin-stats">
          <div className="admin-stat">
            <span>Products</span>
            <strong>{products.length}</strong>
          </div>

          <div className="admin-stat">
            <span>Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="admin-stat">
            <span>In Stock</span>
            <strong>
              {products.reduce(
                (total, product) =>
                  total + product.stock,
                0
              )}
            </strong>
          </div>
        </section>

        {/* Product Management */}

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <p className="section-eyebrow">
                CATALOG
              </p>

              <h2>
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>
            </div>

            {editingProductId && (
              <button
                className="secondary-button"
                onClick={cancelEditing}
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form
            className="product-form"
            onSubmit={saveProduct}
          >

            <div className="form-row">

              <div className="form-group">
                <label>
                  Product Name
                </label>

                <input
                  name="name"
                  value={productForm.name}
                  onChange={handleProductChange}
                  placeholder="Product 1"
                />
              </div>

              <div className="form-group">
                <label>
                  Category
                </label>

                <input
                  name="category"
                  value={productForm.category}
                  onChange={handleProductChange}
                  placeholder="SmokeShield"
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={handleProductChange}
                  placeholder="49.99"
                />
              </div>

              <div className="form-group">
                <label>
                  Stock
                </label>

                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={handleProductChange}
                  placeholder="100"
                />
              </div>

            </div>

            <div className="form-group">
              <label>
                Product Image
              </label>

              <input
                name="image"
                value={productForm.image}
                onChange={handleProductChange}
                placeholder="/products/product-1.jpg"
              />

              <small>
                Enter the image path or URL for
                the product.
              </small>
            </div>

            <div className="form-group">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                placeholder="Describe the product..."
                rows="5"
              />
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={savingProduct}
            >
              {savingProduct
                ? "Saving..."
                : editingProductId
                ? "Update Product"
                : "Add Product"}
            </button>

          </form>
        </section>

        {/* Existing Products */}

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <p className="section-eyebrow">
                INVENTORY
              </p>

              <h2>
                Products
              </h2>
            </div>
          </div>

          {loadingProducts ? (
            <p className="admin-muted">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>
                No products yet
              </h3>

              <p>
                Add your first SmokeShield product
                above.
              </p>
            </div>
          ) : (
            <div className="admin-products">

              {products.map((product) => (
                <article
                  className="admin-product"
                  key={product.id}
                >

                  <div className="admin-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="admin-product-info">

                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="admin-product-description">
                      {product.description}
                    </p>

                    <div className="admin-product-meta">
                      <strong>
                        $
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </strong>

                      <span>
                        {product.stock} in stock
                      </span>
                    </div>

                  </div>

                  <div className="admin-product-actions">

                    <button
                      className="secondary-button"
                      onClick={() =>
                        startEditing(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      onClick={() =>
                        deleteProduct(product)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}
        </section>

        {/* Orders */}

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <p className="section-eyebrow">
                SALES
              </p>

              <h2>
                Customer Orders
              </h2>
            </div>
          </div>

          {loadingOrders ? (
            <p className="admin-muted">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <h3>
                No orders yet
              </h3>

              <p>
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="orders-list">

              {orders.map((order) => (
                <article
                  className="order-card"
                  key={order.id}
                >

                  <div className="order-header">

                    <div>
                      <p className="order-number">
                        ORDER #{order.id}
                      </p>

                      <h3>
                        {order.customer.name}
                      </h3>
                    </div>

                    <div className="order-status">
                      <label>
                        Status
                      </label>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </div>

                  </div>

                  <div className="customer-details">

                    <div>
                      <strong>
                        Username
                      </strong>

                      <span>
                        {order.customer.username}
                      </span>
                    </div>

                    <div>
                      <strong>
                        Email
                      </strong>

                      <span>
                        {order.customer.email}
                      </span>
                    </div>

                    <div>
                      <strong>
                        Phone
                      </strong>

                      <span>
                        {order.customer.phone}
                      </span>
                    </div>

                  </div>

                  <div className="order-items">

                    <h4>
                      Items
                    </h4>

                    {order.items.map((item) => (
                      <div
                        className="order-item"
                        key={item.id}
                      >
                        <span>
                          {item.product.name}
                          {" × "}
                          {item.quantity}
                        </span>

                        <strong>
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </strong>
                      </div>
                    ))}

                  </div>

                  <div className="order-total">

                    <div>
                      <span>
                        Subtotal
                      </span>

                      <strong>
                        $
                        {Number(
                          order.subtotal
                        ).toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Shipping
                      </span>

                      <strong>
                        {order.shippingCost === 0
                          ? "FREE"
                          : `$${Number(
                              order.shippingCost
                            ).toFixed(2)}`}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Tax
                      </span>

                      <strong>
                        $
                        {Number(
                          order.tax
                        ).toFixed(2)}
                      </strong>
                    </div>

                    <div className="total-row">
                      <span>
                        Total
                      </span>

                      <strong>
                        $
                        {Number(
                          order.total
                        ).toFixed(2)}
                      </strong>
                    </div>

                  </div>

                  <div className="shipping-details">

                    <h4>
                      Shipping Address
                    </h4>

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

                    <p>
                      {order.shippingCountry}
                    </p>

                  </div>

                  <p className="order-date">
                    Order Date:{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default Admin;