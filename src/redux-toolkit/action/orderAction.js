import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:1433';
const getUserToken = () => localStorage.getItem('userToken');

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    const userToken = getUserToken();
    if (!userToken) {
      return rejectWithValue('User token is not available');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/order/get-orders`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id, { rejectWithValue }) => {
    const userToken = getUserToken();
    if (!userToken) {
      return rejectWithValue('User token is not available');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/order/get-order-items?orderId=${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMakeOrder = createAsyncThunk(
  'orders/fetchMakeOrder',
  async (data, { rejectWithValue }) => {
    const userToken = getUserToken();
    console.log(data);
    if (!userToken) {
      return rejectWithValue('User token is not available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/order/order-from-cart`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCancelOrder = createAsyncThunk(
  'orders/fetchCancelOrder',
  async (id, { rejectWithValue }) => {
    const userToken = getUserToken();
    console.log(id);
    if (!userToken) {
      return rejectWithValue('User token is not available');
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/order/cancel-order`, id, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);


