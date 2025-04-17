import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../../ax";

const CartContext = createContext();

const useCart = () => useContext(CartContext);

const Cart = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mengambil data keranjang dari API atau localStorage
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/cart-items");
        console.log("Cart Items Response:", response.data); // Debug response
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
          localStorage.setItem("cartItems", JSON.stringify(response.data)); // Simpan ke localStorage
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);

        // Jika API gagal, gunakan data dari localStorage
        const savedCartItems = localStorage.getItem("cartItems");
        if (savedCartItems) {
          setCartItems(JSON.parse(savedCartItems));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Menambahkan produk ke keranjang
  const addToCart = async (product, quantity) => {
    try {
      const response = await axiosInstance.post(`/api/cart-item/${product.id}`, {
        quantity,
      });
      const newCartItem = response.data.data;

      setCartItems((prev) => [...prev, newCartItem]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...cartItems, newCartItem])
      ); // Perbarui localStorage
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Menghapus produk dari keranjang
  const removeFromCart = async (id) => {
    try {
      await axiosInstance.delete(`/api/delete/cartItem/${id}`);
      const updatedCartItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Perbarui localStorage
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Memperbarui jumlah produk di keranjang
  const updateQuantity = async (id, quantity) => {
    try {
      const response = await axiosInstance.put(`/api/update/cartItem/${id}`, {
        quantity,
      });
      const updatedCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: response.data.quantity } : item
      );

      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Perbarui localStorage
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // Total harga semua produk di keranjang
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.subtotal_price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { Cart, useCart };
