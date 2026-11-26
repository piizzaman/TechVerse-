import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getProduct,
  getProducts,
} from "../api/products";

import { useCart } from "../context/CartContext";

import "../styles/product-details.css";

function ProductDetails() {
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [quantity, setQuantity] = useState(1);

  const [addedToCart, setAddedToCart] =
    useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const currentProduct =
          await getProduct(id);

        const products = await getProducts();

        setProduct(currentProduct);

        setRelatedProducts(
          products.filter(
            (p) =>
              p.category ===
                currentProduct.category &&
              p.id !== currentProduct.id
          )
        );
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );
      }
    }

    loadData();

    setQuantity(1);
    setAddedToCart(false);
  }, [id]);

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-loading">
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  };

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link to="/">
            Home
          </Link>

          <span> / </span>

          <span>{product.category}</span>

          <span> / </span>

          <strong>{product.name}</strong>
        </div>

        {/* Main Product */}
        <section className="product-main">

          {/* Product Image */}
          <div className="product-gallery">
            <div className="product-main-image">
              <img
                src={product.image}
                alt={product.name}
              />

              {isOutOfStock && (
                <span className="product-out-badge">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="product-information">

            <p className="product-detail-category">
              {product.category}
            </p>

            <h1>
              {product.name}
            </h1>

            <div className="product-detail-price">
              ${product.price.toFixed(2)}
            </div>

            <div className="product-stock-status">
              {isOutOfStock ? (
                <span className="stock-unavailable">
                  Currently unavailable
                </span>
              ) : (
                <span className="stock-available">
                  ● {product.stock} available
                </span>
              )}
            </div>

            <div className="product-detail-divider" />

            <p className="product-detail-description">
              {product.description}
            </p>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="quantity-section">

                <label>
                  Quantity
                </label>

                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1
                        )
                      )
                    }
                    disabled={quantity <= 1}
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          quantity + 1,
                          product.stock
                        )
                      )
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                  >
                    +
                  </button>

                </div>
              </div>
            )}

            {/* Add To Cart */}
            {isOutOfStock ? (
              <button
                className="add-to-cart-button disabled"
                disabled
              >
                Out of Stock
              </button>
            ) : (
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                {addedToCart
                  ? "✓ Added to Cart"
                  : "Add to Cart"}
              </button>
            )}

            {/* Product Details */}
            <div className="product-features">

              <div className="feature">
                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Quality Product
                  </strong>

                  <p>
                    Built with attention to
                    detail.
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  ↻
                </div>

                <div>
                  <strong>
                    Reliable Support
                  </strong>

                  <p>
                    We're here when you need us.
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  🔒
                </div>

                <div>
                  <strong>
                    Secure Checkout
                  </strong>

                  <p>
                    Your payment is securely
                    processed.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">

            <div className="related-header">
              <div>
                <p>
                  YOU MAY ALSO LIKE
                </p>

                <h2>
                  Related Products
                </h2>
              </div>

              <Link to="/">
                View all products →
              </Link>
            </div>

            <div className="related-grid">

              {relatedProducts.map(
                (relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.id}`}
                    className="related-card"
                  >
                    <div className="related-image">
                      <img
                        src={
                          relatedProduct.image
                        }
                        alt={
                          relatedProduct.name
                        }
                      />
                    </div>

                    <div className="related-content">

                      <p>
                        {
                          relatedProduct.category
                        }
                      </p>

                      <h3>
                        {
                          relatedProduct.name
                        }
                      </h3>

                      <strong>
                        $
                        {relatedProduct.price.toFixed(
                          2
                        )}
                      </strong>

                    </div>
                  </Link>
                )
              )}

            </div>
          </section>
        )}

        {/* Back */}
        <div className="back-to-products">
          <Link to="/">
            ← Back to Products
          </Link>
        </div>

      </div>
    </main>
  );
}

export default ProductDetails;