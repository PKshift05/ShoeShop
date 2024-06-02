import { createSlice } from "@reduxjs/toolkit";
import { fetchProductsByCategory, fetchProductsSearch } from "../action/productAction";

const initialState = {
  loading: false,
  products: [],
  productBySup: {
    items: [],
    status: 'idle',
    error: null,
    total: 0,
  },
  productSearch:[
  ],
  error: null,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    STORE_PRODUCTS: (state, action) => {
      state.products = action.payload;
    },
    RESET_PRODUCT_BY_SUP: (state) => {
      state.productBySup = { items: [], status: 'idle', error: null, total: 0 };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.productBySup.status = 'loading';
        state.productBySup.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productBySup.items = action.payload.data;
        state.productBySup.total = action.payload.total;
        state.productBySup.status = 'succeeded';
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.productBySup.items = [];
        state.productBySup.status = 'failed';
        state.productBySup.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchProductsSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.productSearch=action.payload.data;
      })
      .addCase(fetchProductsSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { STORE_PRODUCTS, STORE_GIRL_PRODUCTS, STORE_BOY_PRODUCTS, STORE_CHILD_PRODUCTS,RESET_PRODUCT_BY_SUP } = productSlice.actions;

export const selectProducts = (state) => state.product.products;
export const selectGirlProducts = (state) => state.product.girlProducts;
export const selectBoyProducts = (state) => state.product.boyProducts;
export const selectChildProducts = (state) => state.product.childProducts;
export const selectProductBySub = (state) => state.product.productBySup;
export const selectProductSearch = (state) => state.product.productSearch;

export default productSlice.reducer;
