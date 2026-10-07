import { ChatLayout } from './components/ChatLayout';
import { ConnectScreen } from './components/ConnectScreen';
import { useConnection } from './features/connection/useConnection';
import { useReceiver } from './features/receiver/useReceiver';

export default function App() {
  useReceiver();
  const connection = useConnection();

  if (connection.status === 'connected') {
    return <ChatLayout onDisconnect={connection.disconnect} />;
  }
  return <ConnectScreen connection={connection} />;
}
