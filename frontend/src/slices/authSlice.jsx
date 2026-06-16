import { createSlice } from '@reduxjs/toolkit'
// слайс хранит авторизацию и сам токен
const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuth: false, token: ''},
  reducers: {
    setAuthStatus: (state, action) => {
      state.isAuth = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    }
  }
})

export const { setAuthStatus, setToken } = authSlice.actions
export default authSlice.reducer
