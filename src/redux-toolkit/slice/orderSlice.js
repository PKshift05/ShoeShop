import { createSlice } from '@reduxjs/toolkit';
import { fetchOrders, fetchOrderDetails, fetchMakeOrder, fetchCancelOrder } from '../action/orderAction';

const initialState = {
  orders: [],
  OrderDetail:[],
  loading: false,
  message:null,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Các reducer nếu cần thiết
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.OrderDetail = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMakeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMakeOrder.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.status===0 ?state.message=action.payload.message : state.error= action.payload.message;
      })
      .addCase(fetchMakeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchCancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.status===0 ?state.message=action.payload.message : state.error= action.payload.message;
      })
      .addCase(fetchCancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});


export const selectLoading = state => state.orders.loading;
export default orderSlice.reducer;
