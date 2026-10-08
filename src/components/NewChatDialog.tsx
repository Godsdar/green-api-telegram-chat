import { Button, Input, Typography } from '@maxhub/max-ui';
import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useCheckAccountMutation } from '../api/greenApi';
import { useAppDispatch } from '../app/hooks';
import { ensureChat, setActiveChat } from '../features/chats/chatsSlice';
import { isValidPhone, normalizePhone } from '../lib/format';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Modal that creates a chat from a phone number via checkAccount. */
export const NewChatDialog = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checkAccount, { isLoading }] = useCheckAccountMutation();

  useEffect(() => {
    if (!open) {
      setPhone('');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isValidPhone(phone)) {
      setError('newChat.invalid');
      return;
    }
    const normalized = normalizePhone(phone);

    try {
      const result = await checkAccount({ phoneNumber: Number(normalized) }).unwrap();
      if (!result.exist || !result.chatId) {
        setError('newChat.notFound');
        return;
      }
      dispatch(
        ensureChat({
          chatId: result.chatId,
          title: result.username || `+${normalized}`,
          phoneNumber: normalized,
        }),
      );
      dispatch(setActiveChat(result.chatId));
      onClose();
    } catch {
      setError('newChat.notFound');
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={t('newChat.title')}>
      <div className="modal__backdrop" onClick={onClose} />
      <form className="modal__card" onSubmit={onSubmit}>
        <h2 className="modal__title">
          <Typography.Title variant="medium-strong">{t('newChat.title')}</Typography.Title>
        </h2>

        <div className="field">
          <label className="field__label" htmlFor="new-chat-phone">
            <Typography.Label variant="small">{t('newChat.phoneLabel')}</Typography.Label>
          </label>
          <Input
            id="new-chat-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('newChat.phonePlaceholder')}
            autoFocus
            inputMode="tel"
            autoComplete="off"
          />
        </div>

        {error && (
          <p className="modal__error" role="alert">
            {t(error)}
          </p>
        )}

        <div className="modal__actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? t('newChat.checking') : t('newChat.check')}
          </Button>
        </div>
      </form>
    </div>
  );
};
