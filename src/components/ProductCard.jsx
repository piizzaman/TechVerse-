import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  function handleProductClick() {
    navigate(`/products/${product.id}`);
  }

  return (
    <article
      className="product-card"
      onClick={handleProductClick}
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        {product.stock <= 0 && (
          <span className="stock-badge">
            Out of Stock
          </span>
        )}
      </div>

      <div className="product-card-content">
        <p className="product-category">
          {product.category}
        </p>

        <h3 className="product-name">
          {product.name}
        </h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-card-bottom">
          <div>
            <p className="product-price">
              ${product.price.toFixed(2)}
            </p>

            <p
              className={
                product.stock > 0
                  ? "product-stock"
                  : "product-stock out-of-stock"
              }
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          </div>

          <button
            className="view-product-btn"
            onClick={(event) => {
              event.stopPropagation();

              navigate(
                `/products/${product.id}`
              );
            }}
          >
            View Product
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;