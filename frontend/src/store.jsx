import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import channelsReducer from './slices/channelsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer
  }
})
    