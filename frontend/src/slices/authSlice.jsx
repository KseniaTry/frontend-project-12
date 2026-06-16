import { createSlice } from '@reduxjs/toolkit'
// слайс хранит авторизацию и сам токен
const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuth: false, token: ''},
  reducers: {
    isAuth: (state, payload) => {
      state.isAuth = payload
    },
    setToken: (state, payload) => {
      state.token = payload
    }
  }
})

export const { isAuth, setToken } = authSlice.actions
export default authSlice.reducer
