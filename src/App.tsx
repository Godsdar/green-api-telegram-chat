/**
 * Root component. Runs the long-poll receiver and routes between the connect
 * screen and the chat layout based on the connection status.
 */
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
