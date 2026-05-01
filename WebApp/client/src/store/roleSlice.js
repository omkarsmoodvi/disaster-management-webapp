import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAdmin: false,
  role: "none",
  loggedIn: false,
};

const roleSlice = createSlice({
  name: "roleState",
  initialState,
  reducers: {
    changeRole(state, action) {
      if (typeof action.payload === 'object' && !Array.isArray(action.payload)) {
        state.isAdmin = !!action.payload.isAdmin;
        state.role = action.payload.role || "none";
        state.loggedIn = !!action.payload.loggedIn;
      } else if (Array.isArray(action.payload)) {
        const arr = action.payload;
        state.role = arr[0] || "none";
        state.isAdmin = arr.includes("admin");
        state.loggedIn = arr.length > 0;
      } else if (typeof action.payload === 'string') {
        state.role = action.payload;
        state.isAdmin = (action.payload === "admin");
        state.loggedIn = action.payload !== "none";
      }
    },
    clearRole(state) {
      state.role = "none";
      state.isAdmin = false;
      state.loggedIn = false;
    }
  }
});

export const { changeRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
