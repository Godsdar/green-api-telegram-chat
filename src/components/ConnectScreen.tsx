import { Button, Input, Typography } from '@maxhub/max-ui';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { ConnectionController } from '../features/connection/useConnection';
import { setLanguage } from '../i18n';

interface Props {
  connection: ConnectionController;
}

/** Credentials form shown while disconnected. */
export const ConnectScreen = ({ connection }: Props) => {
  const { t, i18n } = useTranslation();
  const [apiUrl, setApiUrl] = useState(connection.credentials.apiUrl);
  const [idInstance, setIdInstance] = useState(connection.credentials.idInstance);
  const [apiTokenInstance, setApiTokenInstance] = useState(connection.credentials.apiTokenInstance);

  const isConnecting = connection.status === 'connecting';
  const canSubmit = Boolean(idInstance.trim() && apiTokenInstance.trim()) && !isConnecting;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    await connection.connect({ apiUrl, idInstance, apiTokenInstance });
  };

  return (
    <div className="connect-screen">
      <div className="connect-card">
        <div className="connect-card__top">
          <div className="connect-card__brand">
            <span className="connect-card__mark" aria-hidden="true">
              G
            </span>
            <div>
              <h1 className="connect-card__title">
                <Typography.Title variant="medium-strong">{t('app.title')}</Typography.Title>
              </h1>
              <p className="connect-card__subtitle">
                <Typography.Body variant="small">{t('connect.title')}</Typography.Body>
              </p>
            </div>
          </div>
          <div className="lang-switch">
            <Button
              type="button"
              size="small"
              variant="ghost"
              className={i18n.language.startsWith('ru') ? 'is-active' : ''}
              onClick={() => setLanguage('ru')}
            >
              RU
            </Button>
            <Button
              type="button"
              size="small"
              variant="ghost"
              className={i18n.language.startsWith('en') ? 'is-active' : ''}
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
          </div>
        </div>

        <p className="connect-card__description">
          <Typography.Body variant="small">{t('connect.description')}</Typography.Body>
        </p>

        <form className="connect-form" onSubmit={onSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="connect-id-instance">
              <Typography.Label variant="small">{t('connect.idInstance')}</Typography.Label>
            </label>
            <Input
              id="connect-id-instance"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              placeholder="1101000000"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="connect-api-token">
              <Typography.Label variant="small">{t('connect.apiToken')}</Typography.Label>
            </label>
            <Input
              id="connect-api-token"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              placeholder="a1b2c3d4e5f6..."
              autoComplete="off"
              type="password"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="connect-api-url">
              <Typography.Label variant="small">{t('connect.apiUrl')}</Typography.Label>
            </label>
            <Input
              id="connect-api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.green-api.com"
              autoComplete="off"
            />
          </div>

          {connection.error && (
            <p className="connect-form__error" role="alert">
              {t(connection.error)}
            </p>
          )}

          <Button type="submit" variant="primary" stretched disabled={!canSubmit}>
            {isConnecting ? t('connect.connecting') : t('connect.submit')}
          </Button>
        </form>

        <a
          className="connect-card__hint"
          href="https://console.green-api.com"
          target="_blank"
          rel="noreferrer"
        >
          <Typography.Action variant="small">{t('connect.whereToGet')}</Typography.Action>
        </a>
      </div>
    </div>
  );
};
