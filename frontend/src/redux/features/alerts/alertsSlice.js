import { createSlice } from '@reduxjs/toolkit';

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    items: []
  },
  reducers: {
    pushAlert: (state, action) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) return;
      state.items.unshift(action.payload);
    },
    clearAlerts: (state) => {
      state.items = [];
    }
  }
});

export const { pushAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
