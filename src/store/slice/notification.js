import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const notificationInitialState = {
  open: false,
  type: "info",
  message: "",
  position: { vertical: 'top', horizontal: 'center'},
  timeout: 5000
};
export const NotificationSlice = createSlice({
  name: "notification",
  initialState: notificationInitialState,
  reducers: {
    addNotification: (_state, action) => ({
      ...notificationInitialState,
      ...action.payload,
      open: true
    }),
    clearNotification: (state) => ({ ...state, open: false })
  }
});
export const NotificationActions = NotificationSlice.actions;
export const NotificationReducer = NotificationSlice.reducer;