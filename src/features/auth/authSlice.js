import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  isLoggingOut: false, // Biến để kiểm soát trạng thái đăng xuất
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isLoggingOut = false;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isLoggingOut = true; // Đánh dấu đang đăng xuất
    },
    resetLogout: (state) => {
      state.isLoggingOut = false; // Reset trạng thái đăng xuất
    },
  },
});

export const { login, logout, resetLogout } = authSlice.actions;
export default authSlice.reducer;