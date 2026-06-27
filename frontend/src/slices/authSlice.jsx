import { createSlice } from '@reduxjs/toolkit'
import { getChannels } from './channelsSlice'
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// берем токен из localStorage, так как при обновлении страницы нам нужно пocмтреть, 
// авторизован ли пользователь и в зависимости от этого рендерить initialState
const currentToken = localStorage.getItem('userToken') || ''; 
const currentUsername = localStorage.getItem('username') || '';

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

// слайс хранит авторизацию и сам токен
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    error: null,
    loadingStatus: false,
    isAuth: !!currentToken, 
    token: currentToken ? currentToken : '',
    currentUsername: currentUsername ? currentUsername : '' // храним в localStorage чтобы при обновлении страницы данные не удалялись
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
        localStorage.setItem('userToken', action.payload.token)
        state.isAuth = true
        state.token = action.payload.token
        state.currentUsername = action.payload.username
        state.loadingStatus = 'idle'
        localStorage.setItem('username', action.payload.username)
      })
      .addCase(login.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.isAuth = false
        state.token = ''
        state.currentUsername = ''
        localStorage.removeItem('userToken')
        localStorage.removeItem('username')
        // state.error = action.error ? action.error.message : null
        state.error = action.payload.status === 401 ? 'Неверный логин или пароль' : `Ошибка сервера: ${action.payload.error}. Перезагруите страницу`
      })
      .addCase(getChannels.rejected, (state, action) => {
        const isUnauthorized = action.payload?.status === '401'
        if (isUnauthorized) {
          state.isAuth = false;
          state.token = '';
          localStorage.removeItem('userToken');
        }
      })
  }
})

export const { setAuthStatus, setToken, setCurrentUsername } = authSlice.actions
export default authSlice.reducer
