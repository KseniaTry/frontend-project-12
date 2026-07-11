import { createSlice, createEntityAdapter, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import { getSignUpRoute } from '../routes'

const usersAdapter = createEntityAdapter()

export const createNewUser = createAsyncThunk(
  'users/createNewUser', 
  async ({username, password}, thunkAPI) => {
    try {
      const signUpRoute = getSignUpRoute()
      const response = await axios.post(
        signUpRoute, 
        { username,  password })
      return response.data  // => { token: ..., username: 'newuser' }
    } catch(err) {
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  })

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    errorText: null,
    errorStatus: null
  }),
  reducers: {
    addNewUser: (state, action) => {
      usersAdapter.addOne(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
    // получение всех каналов
      .addCase(createNewUser.fulfilled, (state, action) => { //  action.payload = response.data
        usersAdapter.addOne(state, action.payload)
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.errorText = action.payload ? action.payload.data.error : null
        state.errorStatus = action.payload ? action.payload.status : null
      })
  }
})

const baseSelectors = usersAdapter.getSelectors((state) => state.users);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  // selectIds: selectChannelIds        // Возвращает массив только с ID каналов
} = baseSelectors;

export const { addNewUser } = usersSlice.actions
export default usersSlice.reducer