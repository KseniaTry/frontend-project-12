import { createSlice } from '@reduxjs/toolkit'
import { getChannels } from './channelsSlice'

// берем токен из localStorage, так как при обновлении страницы нам нужно пocмтреть, 
// авторизован ли пользователь и в зависимости от этого рендерить initialState
const currentToken = localStorage.getItem('userToken') || ''; 
const currentUsername = localStorage.getItem('username') || '';

// слайс хранит авторизацию и сам токен
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    isAuth: !!currentToken, 
    token: currentToken ? currentToken : '',
    username: currentUsername ? currentUsername : '' // храним в localStorage чтобы при обновлении страницы данные не удалялись
  },
  reducers: {
    setAuthStatus: (state, action) => {
      state.isAuth = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setUsername: (state, action) => {
      state.username = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getChannels.rejected, (state, action) => {
      console.log(action)
      const isUnauthorized = action.payload?.status === '401'
      console.log(isUnauthorized)
      console.log(state.isAuth)
      if (isUnauthorized) {
        state.isAuth = false;
        state.token = '';
        localStorage.removeItem('userToken');
      }
    })
  }
})

export const { setAuthStatus, setToken, setUsername } = authSlice.actions
export default authSlice.reducer
