import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';

export const store = configureStore({
  reducer: {
    roleState: roleReducer
  }
});
