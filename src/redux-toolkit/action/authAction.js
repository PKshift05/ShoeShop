import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL = 'http://localhost:1433'

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, firstName, lastName, contactNumber, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${backendURL}/register`,
        { firstName, lastName, contactNumber, username, password },
        config
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        `${backendURL}/login`,
        { username, password },
        config
      )
      // store user's token in local storage
      localStorage.setItem('userToken', data.data.token)
      localStorage.setItem('displayName', data.data.username)
      localStorage.setItem('displayEmail', data.data.email)
      localStorage.setItem('password', data.data.password)
      localStorage.setItem('contact', data.data.contactNumber)
      return data
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
  )