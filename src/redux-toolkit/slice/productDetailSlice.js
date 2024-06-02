// src/redux-toolkit/slice/productDetailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductDetails = createAsyncThunk(
  'productDetails/fetchProductDetails',
  async ({ code }) => {
    const encode = encodeURIComponent(code)
    const response = await axios.get(`http://localhost:1433/product/get-product-details?code=${encode}`);
    return response.data;
  }
);

const productDetailSlice = createSlice({
  name: 'productDetails',
  initialState: {
    product: [],
    productDetail:{},
    loading: false,
    error: null,
  },
  reducers: {
    resetProductDetail(state) {
        state.product = [];
        state.productDetail={};
        state.loading = false;
        state.error = null;
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.productDetail = action.payload[0];
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export const { resetProductDetail } = productDetailSlice.actions;
export const selectProductDetails = (state) => state.productDetails.product;
export const selectProductDetailsLoading = (state) => state.productDetails.loading;
export const selectProductDetailsError = (state) => state.productDetails.error;
export const selectProducItemtDetails = (state) => state.productDetails.productDetail;

export default productDetailSlice.reducer;
