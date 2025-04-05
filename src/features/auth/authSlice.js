// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thêm async thunk cho login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5001/api/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || "Đăng nhập thất bại!");
      }
      
      return {
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
        },
        role: data.role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  role: null,
  isLoggingOut: false,
  initialized: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Các synchronous actions
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isLoggingOut = true;
    },
    resetLogout: (state) => {
      state.isLoggingOut = false;
    },
    initialize: (state) => {
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, resetLogout, initialize } = authSlice.actions;
export default authSlice.reducer;