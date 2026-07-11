import { createSlice } from '@reduxjs/toolkit'
import { getChannels } from './channelsSlice'
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createNewUser } from './usersSlice';
import { getLoginRoute } from '../routes';

export const login = createAsyncThunk(
  'auth/login', 
  async (values, thunkAPI) => {
    try {
      const loginRoute = getLoginRoute()
      const response = await axios.post(loginRoute, values)
      return response.data
    } catch(err) {
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  })

// берем токен из localStorage, так как при обновлении страницы нам нужно пocмтреть, 
// авторизован ли пользователь и в зависимости от этого рендерить initialState
const rawToken = localStorage.getItem('userToken');

const hasValidToken = !!rawToken && rawToken !== 'null' && rawToken !== 'undefined';

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    errorText: null,
    errorStatus: null,
    isAuth: hasValidToken, 
    token: hasValidToken ? rawToken : '',
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
      state.currentUsername = action.payload
    },
    resetAuth: (state) => {
      state.isAuth = false;
      state.token = '';
      state.currentUsername = '';
      state.errorText = null;
      state.errorStatus = null;
    },
  },
  extraReducers: (builder) => {
    // получение всех каналов
    builder
      .addCase(login.fulfilled, (state, action) => { //  action.payload = response.data
        state.isAuth = true
        state.token = action.payload.token
        state.currentUsername = action.payload.username
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuth = false
        state.token = ''
        state.currentUsername = ''
        state.errorStatus = action.payload ? action.payload.status : ''
        state.errorText = action.payload ? action.payload.data.error : ''
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

export const { setAuthStatus, setToken, setCurrentUsername , resetAuth} = authSlice.actions
export default authSlice.reducer
