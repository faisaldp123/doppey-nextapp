import { configureStore } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
import { themeSlice } from './slice/theme';
import { filterSlice } from './slice/filter';
import { dashboardSlice } from './slice/dashboard';
import { NotificationReducer, NotificationSlice } from './slice/notification';

export const store = configureStore({
  reducer: {
    [NotificationSlice.name]: NotificationSlice.reducer,
    [themeSlice.name]: themeSlice.reducer,
    [filterSlice.name]: filterSlice.reducer,
    [dashboardSlice.name]: dashboardSlice.reducer
  },
  // middleware: (mid) => {
  //   return mid().concat(api.middleware)
  // }
})
