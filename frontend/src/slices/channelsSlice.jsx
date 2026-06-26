import { createSlice, createEntityAdapter, createAsyncThunk , current} from '@reduxjs/toolkit'
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

export const removeChannelFromServer = createAsyncThunk(
  'channels/removeChannelFromServer',
  async(channelId, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const response = await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      })
      return response.data
    } catch(err) {
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  }
)

// const editedMessage = { body: 'new body message' };
export const editChannel = createAsyncThunk(
  'channels/editChannel',
  async({channelId, editedChannel}, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const response = await axios.patch(`/api/v1/channels/${channelId}`, editedChannel, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      }) 
      return response.data
    } catch(err) {
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
    setDefaultChannelId: (state) => {
      const channels = channelsAdapter.getSelectors().selectAll(state)
      const defaultActiveChannel = channels.find((channel) => channel.name === 'general');
      state.activeChannelId = defaultActiveChannel?.id || null
    },
    setActiveChannelId: (state, action) => {
      localStorage.setItem('activeChannel', action.payload)
      state.activeChannelId = action.payload
    },
    addNewChannel: (state, action) => {
      console.log('Текущие каналы:', current(state.entities));
      channelsAdapter.addOne(state, action.payload)
    },
    removeChannel: (state, action) => {
      channelsAdapter.removeOne(state, action.payload)
    },
    renameChannel: (state, action) => {
      const id = action.payload.id
      channelsAdapter.updateOne(state, {id, changes: {name: action.payload.name}})
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
        console.log(action.payload)
        channelsSlice.caseReducers.setDefaultChannelId(state) // вызываем обычный редьюсер внутри extra reducer 
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
        channelsAdapter.addOne(state, action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.error ? action.error.message : null
      })
      // удаление канала
      .addCase(removeChannelFromServer.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(removeChannelFromServer.fulfilled, (state, action) => {
        channelsAdapter.removeOne(state, action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(removeChannelFromServer.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.error ? action.error.message : null
      })
    // переименование канала
      .addCase(editChannel.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(editChannel.fulfilled, (state, action) => {
        const id = action.payload.id
        channelsAdapter.updateOne(state, {id, changes: {name: action.payload.name}})
        state.loadingStatus = 'idle'
      })
      .addCase(editChannel.rejected, (state, action) => {
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

export const { setActiveChannelId, addNewChannel, removeChannel, setDefaultChannelId, renameChannel } = channelsSlice.actions
export default channelsSlice.reducer