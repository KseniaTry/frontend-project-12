import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const channelsAdapter = createEntityAdapter()

export const getChannels = createAsyncThunk(
  'channels/getChannels', 
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const response = await axios.get('/api/v1/channels', {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data
    } catch(err) {
      // с помощью thunkAPI мы получаем конкретный код ошибки (401), 
      // чтобы далее можно было корректно ее обработать и сделать 
      // перенаправление на страницу Login при отсутствии токена авторизации
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  })

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async(newChannel, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const response = await axios.post('/api/v1/channels', newChannel, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      })
      return response.data
    } catch(err) {
      console.log(err)
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  }
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({
    loadingStatus: false,
    error: null,
    activeChannelId: ''
  }),
  reducers: {
    setActiveChannelId: (state, action) => {
      state.activeChannelId = action.payload
    },
    addNewChannel: (state, action) => {
      channelsAdapter.addOne(state, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
    // получение всех каналов
      .addCase(getChannels.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(getChannels.fulfilled, (state, action) => { //  action.payload = response.data
        channelsAdapter.setAll(state, action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(getChannels.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.error ? action.error.message : null
      })
    // добавление канала
      .addCase(addChannel.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.loadingStatus = 'idle'
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.error ? action.error.message : null
      })
  }
})

// 1. Создаем базовые селекторы адаптера
const baseSelectors = channelsAdapter.getSelectors((state) => state.channels);

// 2. Экспортируем их с понятными именами
export const {
  selectAll: selectAllChannels,      // Возвращает МАССИВ всех каналов (уже готовый для .map)
  selectById: selectChannelById,    // Находит один канал по его ID
  // selectIds: selectChannelIds        // Возвращает массив только с ID каналов
} = baseSelectors;

export const { setActiveChannelId, addNewChannel } = channelsSlice.actions
export default channelsSlice.reducer