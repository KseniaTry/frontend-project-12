import { createSlice } from '@reduxjs/toolkit'
import { getChannels } from './channelsSlice'
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createNewUser } from './usersSlice';

export const login = createAsyncThunk(
  'auth/login', 
  async (values, thunkAPI) => {
    try {
      const response = await axios.post('/api/v1/login', values)
      return response.data
    } catch(err) {
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  })

// берем токен из localStorage, так как при обновлении страницы нам нужно пocмтреть, 
// авторизован ли пользователь и в зависимости от этого рендерить initialState
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    loadingStatus: false,
    isAuth: !!localStorage.getItem('userToken'), 
    token: localStorage.getItem('userToken') || '',
    currentUsername: localStorage.getItem('username') ||'' // храним в localStorage чтобы при обновлении страницы данные не удалялись
  },
  reducers: {
    setAuthStatus: (state, action) => {
      state.isAuth = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setCurrentUsername: (state, action) => {
      state.username = action.payload
    }
  },
  extraReducers: (builder) => {
    // получение всех каналов
    builder
      .addCase(login.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => { //  action.payload = response.data
        state.isAuth = true
        state.token = action.payload.token
        state.currentUsername = action.payload.username
        state.loadingStatus = 'idle'
      })
      .addCase(login.rejected, (state) => {
        state.loadingStatus = 'failed'
        state.isAuth = false
        state.token = ''
        state.currentUsername = ''
      })
      .addCase(getChannels.rejected, (state, action) => {
        if (action.payload?.status === '401') {
          state.isAuth = false;
          state.token = '';
          localStorage.removeItem('userToken');
        }
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.currentUsername = action.payload.username
        state.token = action.payload.token
        state.isAuth = true
      })
  }
})

export const { setAuthStatus, setToken, setCurrentUsername } = authSlice.actions
export default authSlice.reducer
