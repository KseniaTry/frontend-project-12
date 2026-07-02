export const resources =  {
  ru: {
    translation: {
      delete: 'Удалить',
      rename: 'Переименовать',
      login: 'Войти',
      logout: 'Выйти',
      close: 'Закрыть',
      notifications: {
        success: {
          channelAdd: 'Канал добавлен!',
          channelRename: 'Канал переименован',
          channelDelete: 'Канал удален'
        }
      },
      errors: {
        server: 'Ошибка {{error}}. Попробуйте позже или обновите страницу',
        loading: 'Идет загрузка...',
        login: 'Неверный логин или пароль',
        undefined: 'Неизвестная ошибка',
        404: '404 (not found)',
        500: 'Не удалось выполнить запрос',
        channelsLoading: 'Не удалось загрузить каналы',
        messagesLoading: 'Не удалось загрузить сообщения',
        messageSend: 'Не удалось отправить сообщение',
        channelRemove: 'Не удалось удалить канал',
        channelAdd: 'Не удалось добавить канал',
        channelRename: 'Не удалось переименовать канал'
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
        placeholder: 'Введите сообщение...',
        socketError: 'Ошибка загрузки Socket',
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
        addTitle: 'Добавить канал',
        renameTitle: 'Переименовать канал',
        reset: 'Отменить',
        send: 'Отправить'
      },
      validation: {
        required: 'Обязательное поле',
        usernameLength: 'От 3 до 20 символов',
        passwordLength: 'Не менее 6 символов',
        usernameCheck: 'Пользователь с таким именем уже существует',
        unique: 'Должно быть уникальным',
        passwordConfirm: 'Пароли должны совпадать',
      }
    }
  }
}