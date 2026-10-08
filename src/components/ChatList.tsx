import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CellAction,
  CellList,
  Counter,
  Icon16SearchOutline,
  Input,
  Typography,
} from '@maxhub/max-ui';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveChatId, selectChatList } from '../features/chats/selectors';
import { setActiveChat } from '../features/chats/chatsSlice';
import { formatTime, initials } from '../lib/format';
import { ConnectionBadge } from './ConnectionBadge';
import { PlusIcon } from './Icons';

interface Props {
  onNewChat: () => void;
}

/** Sidebar: searchable chat list with unread counters. */
export const ChatList = ({ onNewChat }: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChatList);
  const activeId = useAppSelector(selectActiveChatId);
  const status = useAppSelector((state) => state.connection.status);
  const [query, setQuery] = useState('');

  const visible = query
    ? chats.filter((chat) => chat.title.toLowerCase().includes(query.toLowerCase()))
    : chats;

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__title">
          {t('chats.title')}
          <ConnectionBadge status={status} compact />
        </span>
        <button
          type="button"
          className="icon-button"
          onClick={onNewChat}
          aria-label={t('chats.newChat')}
          title={t('chats.newChat')}
        >
          <PlusIcon />
        </button>
      </div>

      <div className="sidebar__search">
        <Input
          iconBefore={<Icon16SearchOutline />}
          withClearButton
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('chats.searchPlaceholder')}
        />
      </div>

      <CellList className="chat-list">
        {visible.length === 0 && (
          <div className="chat-list__empty">
            <p>{t('chats.empty')}</p>
            <p className="chat-list__empty-hint">{t('chats.emptyHint')}</p>
          </div>
        )}

        {visible.map((chat) => {
          const last = chat.messages[chat.messages.length - 1];
          const isActive = chat.chatId === activeId;
          return (
            <CellAction
              key={chat.chatId}
              className={`chat-item${isActive ? ' chat-item--active' : ''}`}
              onClick={() => dispatch(setActiveChat(chat.chatId))}
              before={<span className="avatar">{initials(chat.title)}</span>}
            >
              <span className="chat-item__body">
                <span className="chat-item__row">
                  <Typography.Text variant="title" className="chat-item__title">
                    {chat.title}
                  </Typography.Text>
                  {last && (
                    <Typography.Text variant="label" color="secondary" className="chat-item__time">
                      {formatTime(last.timestamp, i18n.language)}
                    </Typography.Text>
                  )}
                </span>
                <span className="chat-item__row">
                  <Typography.Text
                    variant="description"
                    color="secondary"
                    className="chat-item__preview"
                  >
                    {last
                      ? `${last.outgoing ? `${t('chat.you')}: ` : ''}${last.text}`
                      : t('chat.empty')}
                  </Typography.Text>
                  {chat.unread > 0 && <Counter value={chat.unread} variant="attention" />}
                </span>
              </span>
            </CellAction>
          );
        })}
      </CellList>
    </div>
  );
};
