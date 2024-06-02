import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendURL = 'http://localhost:1433';

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ supplier, pageNum = 1, pageSize = 8, sortBy = null, category = null, fromPrice = null, toPrice = null }, { rejectWithValue }) => {
    try {
      const config = {
        params: {
          supplier,
          pageNum,
          pageSize,
          sortBy,
          category,
          fromPrice,
          toPrice,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const {data} = await axios.get(
        `${backendURL}/product/get-product`,
        config
      );  

      return data; // Assuming the response contains the products data
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchProductsSearch = createAsyncThunk(
  'products/fetchProductsSearch',
  async ({ name }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const {data} = await axios.get(
        `${backendURL}/product/get-product?name=${name}`,
        config
      );  

      return data; // Assuming the response contains the products data
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
