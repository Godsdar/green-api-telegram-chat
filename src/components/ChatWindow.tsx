import { IconButton, Typography } from '@maxhub/max-ui';
import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CHANNEL } from '../config';
import { selectActiveChat } from '../features/chats/selectors';
import { setActiveChat } from '../features/chats/chatsSlice';
import { dayKey, formatDayLabel, initials } from '../lib/format';
import { ChevronLeftIcon } from './Icons';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';

export const ChatWindow = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const chat = useAppSelector(selectActiveChat);
  const listRef = useRef<HTMLDivElement>(null);

  const messagesCount = chat?.messages.length ?? 0;
  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messagesCount, chat?.chatId]);

  if (!chat) {
    return (
      <section className="chat-window chat-window--empty">
        <div className="empty-state">
          <h2>{t('chat.select')}</h2>
          <p>{t('chat.selectHint')}</p>
        </div>
      </section>
    );
  }

  const labels = { today: t('chat.today'), yesterday: t('chat.yesterday') };

  const nodes: ReactNode[] = [];
  let lastDay = '';
  for (const message of chat.messages) {
    const key = dayKey(message.timestamp);
    if (key !== lastDay) {
      lastDay = key;
      nodes.push(
        <div className="day-divider" key={`day-${key}`}>
          {formatDayLabel(message.timestamp, i18n.language, labels)}
        </div>,
      );
    }
    nodes.push(<MessageBubble key={message.id} message={message} />);
  }

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        <IconButton
          type="button"
          className="icon-button chat-window__back"
          variant="ghost"
          size="small"
          onClick={() => dispatch(setActiveChat(null))}
          aria-label={t('chat.back')}
        >
          <ChevronLeftIcon />
        </IconButton>
        <span className="avatar">{initials(chat.title)}</span>
        <div className="chat-window__info">
          <Typography.Text className="chat-window__title" variant="title" color="primary">
            {chat.title}
          </Typography.Text>
          <Typography.Text className="chat-window__channel" variant="detail" color="secondary">
            {CHANNEL === 'telegram' ? 'Telegram' : CHANNEL}
          </Typography.Text>
        </div>
      </header>

      <div className="chat-window__messages" ref={listRef}>
        {nodes.length === 0 ? (
          <div className="empty-state empty-state--inline">
            <p>{t('chat.empty')}</p>
          </div>
        ) : (
          nodes
        )}
      </div>

      <MessageComposer chatId={chat.chatId} />
    </section>
  );
};
