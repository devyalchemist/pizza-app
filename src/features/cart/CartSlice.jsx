import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      if (Object.keys(action.payload).length < 1) return state;
      state.cart = state.cart.map((item) =>
        item.pizzaId === action.payload.pizzaId
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.unitPrice,
            }
          : item,
      );
      const existInCart = state.cart.some(
        (item) => item.pizzaId === action.payload.pizzaId,
      );
      !existInCart && state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      state.cart = state.cart.map((item) =>
        item.pizzaId === action.payload
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.unitPrice,
            }
          : item,
      );
    },
    decreaseItemQuantity(state, action) {
      state.cart = state.cart.map((item) =>
        item.pizzaId === action.payload
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: (item.quantity - 1) * item.unitPrice,
            }
          : item,
      );
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  clearCart,
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);
export const getCart = (state) => state.cart.cart;
export const getCurrentItemQuantity = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
