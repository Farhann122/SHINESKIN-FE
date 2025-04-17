import { useMutation, useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import axiosInstance from "../../ax";

const CartContext = createContext();

const useCart = () => useContext(CartContext);

const fetchCartItems = async () => {
  const response = await axiosInstance.get("/api/cart-items");
  const { data, total_price } = response.data;
  // console.log(response.data);
  return { items: data, totalPrice: total_price };
};

const Cart = ({ children }) => {
  const isLogin = !!localStorage.getItem("token");

  const {
    data: { items: cartItems = [], totalPrice = 0 } = {},
    isLoading,
    refetch,  
  } = useQuery({
    queryKey: ["cartItems"],
    queryFn: fetchCartItems,
    refetchInterval: 1000,
    enabled: isLogin,
    initialData: { items: [], totalPrice: 0 },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await axiosInstance.post(`/api/cart-item/${productId}`, {
        quantity,
      });
      // console.log(response.data.data);
      return response.data.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const removefromCartMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/api/delete/cartItem/${id}`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      if (quantity < 1) throw new Error("Quantity tidak boleh kurang dari 1");
      const response = await axiosInstance.put(`/api/update/cartItem/${id}`, {
        quantity,
      });
      // console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const addToCart = (productId, quantity) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const removeFromCart = (id) => {
    removefromCartMutation.mutate(id);
  };

  const updateQuantity = (id, quantity) => {
    updateQuantityMutation.mutate({ id, quantity });
  };

  const grandTotalPrice = totalPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        grandTotalPrice,
        loading: isLoading,
        refetchCart: refetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { Cart, useCart };
