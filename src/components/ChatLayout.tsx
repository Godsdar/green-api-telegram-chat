import { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { NewChatDialog } from './NewChatDialog';
import { Rail } from './Rail';

interface Props {
  onDisconnect: () => void;
}

/** App shell: rail + chat list + chat window + new-chat dialog. */
export const ChatLayout = ({ onDisconnect }: Props) => {
  const [newChatOpen, setNewChatOpen] = useState(false);
  const hasActiveChat = useAppSelector((state) => Boolean(state.chats.activeChatId));

  return (
    <div className={`app-shell${hasActiveChat ? ' app-shell--chat-open' : ''}`}>
      <Rail onDisconnect={onDisconnect} />
      <ChatList onNewChat={() => setNewChatOpen(true)} />
      <ChatWindow />
      <NewChatDialog open={newChatOpen} onClose={() => setNewChatOpen(false)} />
    </div>
  );
};
