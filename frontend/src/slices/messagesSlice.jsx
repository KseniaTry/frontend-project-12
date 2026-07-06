import { createSlice, createEntityAdapter, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import { createSelector } from '@reduxjs/toolkit'
import { removeChannel } from './channelsSlice'

const messagesAdapter = createEntityAdapter()

// список сообщений (ответ от сервера): 
// [{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]

export const getMessages = createAsyncThunk(
  'messages/getMessages', 
  async (_, thunkAPI) => {
    try {
      // throw { response: { status: 500, data: 'Ошибка базы данных' } };
      const state = thunkAPI.getState()
      const response = await axios.get('/api/v1/messages', {
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

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async(newMessage, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const response = await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
    
      return response.data
    } catch(err) {
      return thunkAPI.rejectWithValue({ 
        status: err.response?.status, 
        data: err.response?.data 
      }) 
    }
  }
)

export const deleteMessage = createAsyncThunk(
  'messages/removeMessage',
  async(messageId, thunkAPI) => {   
    try {
      const state = thunkAPI.getState()
      const response = await axios.delete(`/api/v1/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      })
      return response.data
    } catch(err) {
      return thunkAPI.rejectWithValue({ 
        status: err.response?.status, 
        data: err.response?.data 
      }) 
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    loadingStatus: false,
    errorText: null,
    errorStatus: null
  }),
  reducers: {
    addMessage: (state, action) => {
      messagesAdapter.addOne(state, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
    // загрузка всех сообщений при инициализации мессенджера
      .addCase(getMessages.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(getMessages.fulfilled, (state, action) => { //  action.payload = response.data
        messagesAdapter.setAll(state, action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
      })
      // отправка сообщения
      .addCase(sendMessage.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(sendMessage.fulfilled, (state, action) => { 
        messagesAdapter.addOne(state, action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
      })
      // удаление сообщения
      .addCase(deleteMessage.pending, (state) => {
        state.loadingStatus = 'loading'
      })
      .addCase(deleteMessage.fulfilled, (state, action) => { 
        messagesAdapter.removeOne(state, action.payload)
        state.loadingStatus = 'idle'
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.errorText = action.payload ? action.payload.data : null
        state.errorStatus = action.payload ? action.payload.status : null
      })
      // удаление всех сообщений при удалении канала
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload
        const messages = Object.values(state.entities)
        const restMessages = messages.filter((message) => message.channelId !== channelId)
        messagesAdapter.setAll(state, restMessages)
      })
  }
})

const baseSelectors = messagesAdapter.getSelectors((state) => state.messages);

export const {
  selectAll: selectAllMessages,      // Возвращает МАССИВ всех сообщений (уже готовый для .map)
  selectById: selectMessageById,    // Находит одно сообщение по его ID
} = baseSelectors;

// кастомный селектор для подсчета количества сообщений в конкретном канале
export const selectMessagesByChannel = (activeChannelId) => createSelector(
  [selectAllMessages],
  (messages) => messages.filter((message) => message.channelId === activeChannelId)
)

export const {addMessage} = messagesSlice.actions
export default messagesSlice.reducer