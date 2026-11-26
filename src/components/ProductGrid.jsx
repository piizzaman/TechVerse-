import "../styles/products.css";

import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import ProductCard from "./ProductCard";

function ProductGrid({ search }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    }

    loadProducts();
  }, []);

  const categories = [
    "All",
    "Graphics Cards",
    "Keyboards",
    "Audio",
    "Accessories",
    "Displays",
    "Storage",
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "price-high") {
        return b.price - a.price;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return a.id - b.id;
    });

  return (
    <section className="products" id="products">
      <h2>Featured Products</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          margin: "25px 0",
        }}
      >
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight:
                category === item ? "bold" : "normal",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-low">
            Price: Low → High
          </option>
          <option value="price-high">
            Price: High → Low
          </option>
          <option value="name">
            Name: A → Z
          </option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <h3>No products found.</h3>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ProductGrid;