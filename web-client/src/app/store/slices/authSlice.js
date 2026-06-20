import { createSlice } from '@reduxjs/toolkit';

// Read localStorage synchronously so the store is hydrated BEFORE
// the first render — this prevents ProtectedRoute from seeing
// isAuthenticated=false and redirecting to /login on page refresh.
const loadInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return { user: JSON.parse(user), token, isAuthenticated: true };
    }
  } catch { /* corrupted data — fall through */ }
  return { user: null, token: null, isAuthenticated: false };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // Kept for backwards-compatibility — no longer needed but harmless
    restoreSession: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    }
  },
});

export const { setCredentials, logoutUser, restoreSession } = authSlice.actions;
export default authSlice.reducer;
