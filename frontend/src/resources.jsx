export const resources =  {
  ru: {
    translation: {
      delete: 'Удалить',
      rename: 'Переименовать',
      login: 'Войти',
      logout: 'Выйти',
      close: 'Закрыть',
      addButton: '+',
      notifications: {
        success: {
          channelAdd: 'Канал создан',
          channelRename: 'Канал переименован',
          channelDelete: 'Канал удалён'
        }
      },
      errors: {
        server: 'Ошибка "{{error}}". Попробуйте позже или обновите страницу',
        loading: 'Идет загрузка...',
        401: 'Неверные имя пользователя или пароль',
        404: '404 (not found)',
        500: 'Не удалось выполнить запрос',
        channelsLoading: 'Не удалось загрузить каналы',
        messagesLoading: 'Не удалось загрузить сообщения',
        messageSend: 'Не удалось отправить сообщение',
        channelRemove: 'Не удалось удалить канал',
        channelAdd: 'Не удалось добавить канал',
        channelRename: 'Не удалось переименовать канал',
        auth: 'Ошибка авторизации',
        registration: 'Ошибка регистрации',
        socket: 'Ошибка загрузки Socket',
      },
      loginForm: {
        registration: 'Регистрация',
        question: 'Нет аккаунта?',
        password: 'Пароль',
        nickname: 'Ваш ник'
      },
      registration: {
        title: 'Регистрация',
        button: 'Зарегистрироваться',
        password: 'Пароль',
        passwordConfirm: 'Подтвердите пароль',
        username: 'Имя пользователя',
      },
      messages: {
        messages_one: '{{count}} сообщение',
        messages_few: '{{count}} сообщения',
        messages_many: '{{count}} сообщений',
        send: 'Отправить',
        placeholder: 'Новое сообщение',
      },
      channels: {
        title: 'Каналы'
      },
      header: {
        title: 'Hexlet Chat',
        loginInButton: 'Войти',
        logOutButton: 'Выйти'
      },
      channelModal: {
        label: 'Имя канала',
        addTitle: 'Добавление канала',
        title: 'Управление каналом',
        reset: 'Отменить',
        send: 'Отправить',
        delete:  'Действительно ли Вы хотите удалить канал "{{channelName}}"?'
      },
      validation: {
        required: 'Обязательное поле',
        length: 'От 3 до 20 символов',
        passwordLength: 'Не менее 6 символов',
        usernameCheck: 'Такой пользователь уже существует',
        unique: 'Должно быть уникальным',
        passwordConfirm: 'Пароли должны совпадать',
      }
    }
  }
}