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
      if (err.response) {
        // Ошибка от сервера (401, 404, 500 и т.д.)
        return thunkAPI.rejectWithValue({ 
          status: err.response?.status, 
          data: err.response?.data 
        });
      }
      
      // Ошибка сети или сломанный URL (клиентская ошибка, нет ответа от сервера)
      return thunkAPI.rejectWithValue({ 
        status: 'NETWORK_ERROR', 
        data: err.message || 'Не удалось связаться с сервером' 
      });
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
    errorText: null,
    errorStatus: null,
    activeChannelId: localStorage.getItem('activeChannelId') || 1
  }),
  reducers: {
    setDefaultChannelId: (state) => {
      const channels = Object.values(state.entities)
      const defaultActiveChannel = channels.find((channel) => channel.name === 'general')
      state.activeChannelId = defaultActiveChannel?.id || null
    },
    setActiveChannelId: (state, action) => {
      state.activeChannelId = action.payload
    },
    addNewChannel: (state, action) => {
      state.activeChannelId = action.payload.id
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
        // if (!action.payload || !Array.isArray(action.payload)) {
        //   state.loadingStatus = 'failed';
        //   state.errorText = 'Получены некорректные данные с сервера';
        //   return; // Выходим из редюсера, предотвращая вызов адаптера
        // }

        channelsAdapter.setAll(state, action.payload)
        channelsSlice.caseReducers.setDefaultChannelId(state) // вызываем обычный редьюсер внутри extra reducer 
        state.loadingStatus = 'idle'
      })
      .addCase(getChannels.rejected, (state, action) => {
        console.log('rejected')
        state.loadingStatus = 'failed'
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
      })
    // добавление канала
      .addCase(addChannel.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        channelsAdapter.addOne(state, action.payload)
        state.activeChannelId = action.payload.id
        state.loadingStatus = 'idle'
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
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
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
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
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
      })
  }
})

const baseSelectors = channelsAdapter.getSelectors((state) => state.channels);

export const {
  selectAll: selectAllChannels,      // Возвращает МАССИВ всех каналов (уже готовый для .map)
  selectById: selectChannelById,    // Находит один канал по его ID
} = baseSelectors;

export const { setActiveChannelId, addNewChannel, removeChannel, setDefaultChannelId, renameChannel } = channelsSlice.actions
export default channelsSlice.reducer