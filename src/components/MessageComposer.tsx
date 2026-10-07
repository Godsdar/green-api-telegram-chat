import { IconButton, Textarea } from '@maxhub/max-ui';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MAX_MESSAGE_LENGTH } from '../config';
import { useSendMessage } from '../features/messaging/useSendMessage';
import { SendIcon } from './Icons';

interface Props {
  chatId: string;
}

export const MessageComposer = ({ chatId }: Props) => {
  const { t } = useTranslation();
  const send = useSendMessage();
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const submit = async () => {
    if (!canSend) return;
    const value = text;
    setText('');
    const ok = await send(chatId, value);
    if (!ok) setText(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <div className="composer">
      <Textarea
        className="composer__input"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        onKeyDown={onKeyDown}
        placeholder={t('chat.placeholder')}
        aria-label={t('chat.placeholder')}
        rows={1}
      />
      <IconButton
        type="button"
        className="composer__send"
        variant="primary"
        size="small"
        onClick={() => void submit()}
        disabled={!canSend}
        aria-label={t('chat.send')}
        title={t('chat.send')}
      >
        <SendIcon />
      </IconButton>
    </div>
  );
};
