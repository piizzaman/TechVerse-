import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("techverse-cart");

    try { return savedCart ? JSON.parse(savedCart) : []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(
      "techverse-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }

  setCart((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
};

  const clearCart = () => {
    setCart([]);
  };

  const total = cart
    .reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    )
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  total,
}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}