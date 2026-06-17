import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const channelsAdapter = createEntityAdapter()

export const getChannels = createAsyncThunk(
  'channels/getChannels', 
  async (_, { getState }) => {
    const state = getState()
    const response = await axios.get('/api/v1/channels', {
      headers: {
        Authorization: `Bearer ${state.auth.token}`,
      },
    });
    console.log(response.data)
    return response.data
  })

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({
    loadingStatus: false,
    error: null
  }),
  reducers: {
  },
  extraReducers: (builder) => {
    builder
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
  }
})

// 1. Создаем базовые селекторы адаптера
const baseSelectors = channelsAdapter.getSelectors((state) => state.channels);

// 2. Экспортируем их с понятными именами
export const {
  selectAll: selectAllChannels,      // Возвращает МАССИВ всех каналов (уже готовый для .map)
  // selectById: selectChannelById,    // Находит один канал по его ID
  // selectIds: selectChannelIds        // Возвращает массив только с ID каналов
} = baseSelectors;

export default channelsSlice.reducer