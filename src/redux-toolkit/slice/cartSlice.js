import { createSlice } from "@reduxjs/toolkit"
import { fetchCartItems, addItemToCart, updateCartItem, deleteCartItem } from "../action/cartAction";
import { toast } from "react-toastify"

//CÁI REDUX NÀY CHỈ ĐỂ CHỨA {
// SẢN PHẨM,
// SỐ LƯỢNG CỦA SẢN PHẨM ĐÓ
// } (MỖI USER SẼ LÀ 1 REDUX RIÊNG)
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload.id);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export const selectCartItems = state => state.cart.items;
export const selectCartStatus = state => state.cart.status;
export const selectTotalPayment = (state) =>
  Array.isArray(state.cart.items)
    ? state.cart.items.reduce((total, item) => total + item.quantity * item.price, 0)
    : 0;
export const selectTotalDiscout = (state) =>
  Array.isArray(state.cart.items)
    ? state.cart.items.reduce((total, item) => total + item.quantity * item.price*item.discount, 0)
    : 0;
export default cartSlice.reducer;


// export const { CAlC_TOTAL_PAYMENT } = cartSlice.actions
// export const selectTotalPayment = (state) => state.cart.cartTotalPayment
// export const selectCartItems = (state) => state.cart.cartItems
// export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity
// export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount
// export default cartSlice.reducer
