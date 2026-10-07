import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '../features/chats/chatsSlice';
import { formatTime } from '../lib/format';
import { AlertIcon, CheckIcon, ClockIcon, DoubleCheckIcon } from './Icons';

interface Props {
  message: ChatMessage;
}

const StatusIcon = ({ status }: { status: NonNullable<ChatMessage['status']> }) => {
  switch (status) {
    case 'pending':
      return <ClockIcon className="bubble__status bubble__status--pending" />;
    case 'failed':
      return <AlertIcon className="bubble__status bubble__status--failed" />;
    case 'read':
      return <DoubleCheckIcon className="bubble__status bubble__status--read" />;
    case 'delivered':
      return <DoubleCheckIcon className="bubble__status" />;
    case 'sent':
    default:
      return <CheckIcon className="bubble__status" />;
  }
};

export const MessageBubble = ({ message }: Props) => {
  const { t, i18n } = useTranslation();
  const modifier = message.outgoing ? 'bubble--out' : 'bubble--in';

  return (
    <div className={`bubble ${modifier}`}>
      <span className="bubble__text">{message.text}</span>
      <span className="bubble__meta">
        <span className="bubble__time">{formatTime(message.timestamp, i18n.language)}</span>
        {message.outgoing && message.status && (
          <span className="bubble__status-wrap" title={t(`message.status.${message.status}`)}>
            <StatusIcon status={message.status} />
          </span>
        )}
      </span>
    </div>
  );
};
