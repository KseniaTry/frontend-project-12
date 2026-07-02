import { createSlice, createEntityAdapter, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const usersAdapter = createEntityAdapter()

export const createNewUser = createAsyncThunk(
  'users/createNewUser', 
  async ({username, password}, thunkAPI) => {
    try {
      const response = await axios.post(
        '/api/v1/signup', 
        { username,  password })
      return response.data  // => { token: ..., username: 'newuser' }
    } catch(err) {
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  })

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loadingStatus: false,
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
      .addCase(createNewUser.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(createNewUser.fulfilled, (state, action) => { //  action.payload = response.data
        usersAdapter.addOne(state, action.payload)
        console.log(action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
        // state.error = action.payload.status === 409 ? 'Пользователь уже существует' : `Ошибка сервера: ${action.payload.error}. Перезагруите страницу` 
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