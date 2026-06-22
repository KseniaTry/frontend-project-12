import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createSelector } from '@reduxjs/toolkit'

const messagesAdapter = createEntityAdapter()

// список сообщений (ответ от сервера): 
// [{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]

export const getMessages = createAsyncThunk(
  'messages/getMessages', 
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const response = await axios.get('/api/v1/messages', {
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
      return thunkAPI.rejectWithValue({ status: err.response?.status, data: err.response?.data }) 
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    loadingStatus: false,
    error: null,
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
        state.error = action.error ? action.error.message : null
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
        state.error = action.error ? action.error.message : null
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