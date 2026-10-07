export const ru = {
  app: {
    title: 'GREEN-API Chat',
    subtitle: 'Сообщения Telegram через шлюз GREEN-API',
  },
  connect: {
    title: 'Подключите инстанс',
    description:
      'Введите данные из личного кабинета GREEN-API. Инстанс должен быть авторизован (QR) и настроен на получение через HTTP API.',
    apiUrl: 'Хост API',
    idInstance: 'idInstance',
    apiToken: 'apiTokenInstance',
    submit: 'Подключиться',
    connecting: 'Подключаемся…',
    whereToGet: 'Данные выдаются на console.green-api.com',
  },
  connection: {
    status: {
      connected: 'Подключено',
      connecting: 'Подключение',
      disconnected: 'Отключено',
      error: 'Ошибка',
    },
    state: {
      notAuthorized: 'Инстанс не авторизован. Отсканируйте QR-код в кабинете GREEN-API.',
      starting: 'Инстанс запускается. Попробуйте через минуту.',
      sleepMode: 'Инстанс в режиме сна.',
      yellowCard: 'На инстансе жёлтая карточка. Снизьте частоту отправки.',
      blocked: 'Инстанс заблокирован.',
      suspended: 'Инстанс приостановлен.',
    },
    error: {
      missingCredentials: 'Укажите idInstance и apiTokenInstance.',
      network: 'Ошибка сети. Проверьте хост API и подключение.',
      unauthorized: 'Не авторизовано: неверный idInstance или apiTokenInstance.',
      http: 'Шлюз вернул ошибку. Проверьте данные и состояние инстанса.',
      unknown: 'Не удалось подключиться. Попробуйте ещё раз.',
    },
  },
  chats: {
    title: 'Чаты',
    newChat: 'Новый чат',
    empty: 'Пока нет чатов',
    emptyHint: 'Создайте чат, введя номер телефона.',
    searchPlaceholder: 'Поиск',
  },
  chat: {
    select: 'Выберите чат',
    selectHint: 'Выберите чат слева или создайте новый.',
    empty: 'Сообщений пока нет',
    placeholder: 'Введите сообщение',
    send: 'Отправить',
    you: 'Вы',
    back: 'Назад',
    today: 'Сегодня',
    yesterday: 'Вчера',
  },
  newChat: {
    title: 'Новый чат',
    phoneLabel: 'Номер телефона получателя',
    phonePlaceholder: '79991234567',
    check: 'Найти и создать',
    checking: 'Проверяем…',
    invalid: 'Введите номер в международном формате, только цифры.',
    notFound: 'Номер не найден в Telegram или скрыт настройками приватности.',
  },
  message: {
    status: {
      pending: 'Отправка',
      sent: 'Отправлено',
      delivered: 'Доставлено',
      read: 'Прочитано',
      failed: 'Ошибка',
    },
  },
  header: {
    logout: 'Отключиться',
  },
  common: {
    close: 'Закрыть',
    cancel: 'Отмена',
  },
} as const;
