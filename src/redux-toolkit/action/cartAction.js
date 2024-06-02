import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:1433';
const userToken = localStorage.getItem('userToken')
console.log(userToken);
// Async thunks for API calls
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
    const response = await axios.get(`${API_BASE_URL}/cart/get-cart-items`, {
      headers: {
        Authorization: `Bearer ${userToken}`, // Replace YOUR_TOKEN with actual token
      },
    });
    console.log('fetchCartItems response:', response.data);
    return response.data; // Ensure this is an array
  });

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async ({productId, quantity}) => {
  const response = await axios.post(`${API_BASE_URL}/cart/add-to-cart`, {productId,quantity}, {
    headers: {
      Authorization: `Bearer ${userToken}`, // Replace YOUR_TOKEN with actual token
    },
  });
  return response.data;
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async (item) => {
  const response = await axios.put(`${API_BASE_URL}/cart/update-cart-item`, item, {
    headers: {
      Authorization: `Bearer ${userToken}`, // Replace YOUR_TOKEN with actual token
    },
  });
  return response.data;
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/cart/delete-cart-item`, {
    data: { id },
    headers: {
      Authorization: `Bearer ${userToken}`, // Replace YOUR_TOKEN with actual token
    },
  });
  return id;
});