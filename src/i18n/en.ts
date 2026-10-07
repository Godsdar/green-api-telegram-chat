export const en = {
  app: {
    title: 'GREEN-API Chat',
    subtitle: 'Telegram messages via the GREEN-API gateway',
  },
  connect: {
    title: 'Connect your instance',
    description:
      'Enter the credentials from your GREEN-API console. The instance must be authorized (QR scan) and set to HTTP API receiving.',
    apiUrl: 'API host',
    idInstance: 'idInstance',
    apiToken: 'apiTokenInstance',
    submit: 'Connect',
    connecting: 'Connecting…',
    whereToGet: 'Get credentials at console.green-api.com',
  },
  connection: {
    status: {
      connected: 'Connected',
      connecting: 'Connecting',
      disconnected: 'Disconnected',
      error: 'Error',
    },
    state: {
      notAuthorized: 'The instance is not authorized. Scan the QR code in the GREEN-API console.',
      starting: 'The instance is starting up. Try again in a moment.',
      sleepMode: 'The instance is in sleep mode.',
      yellowCard: 'The instance has a yellow card. Reduce the sending rate.',
      blocked: 'The instance is blocked.',
      suspended: 'The instance is suspended.',
    },
    error: {
      missingCredentials: 'Enter idInstance and apiTokenInstance.',
      network: 'Network error. Check the API host and your connection.',
      unauthorized: 'Unauthorized: idInstance or apiTokenInstance is incorrect.',
      http: 'The gateway returned an error. Check the credentials and the instance state.',
      unknown: 'Could not connect. Please try again.',
    },
  },
  chats: {
    title: 'Chats',
    newChat: 'New chat',
    empty: 'No chats yet',
    emptyHint: 'Create a chat by entering a phone number.',
    searchPlaceholder: 'Search',
  },
  chat: {
    select: 'Select a chat',
    selectHint: 'Pick a chat on the left or create a new one.',
    empty: 'No messages yet',
    placeholder: 'Write a message',
    send: 'Send',
    you: 'You',
    back: 'Back',
    today: 'Today',
    yesterday: 'Yesterday',
  },
  newChat: {
    title: 'New chat',
    phoneLabel: 'Recipient phone number',
    phonePlaceholder: '79991234567',
    check: 'Find and create',
    checking: 'Checking…',
    invalid: 'Enter the number in international format, digits only.',
    notFound: 'This number is not on Telegram or is hidden by privacy settings.',
  },
  message: {
    status: {
      pending: 'Sending',
      sent: 'Sent',
      delivered: 'Delivered',
      read: 'Read',
      failed: 'Failed',
    },
  },
  header: {
    logout: 'Disconnect',
  },
  common: {
    close: 'Close',
    cancel: 'Cancel',
  },
} as const;
