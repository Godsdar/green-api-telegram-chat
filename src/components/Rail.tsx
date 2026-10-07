import { useTranslation } from 'react-i18next';
import { LogoutIcon } from './Icons';

interface Props {
  onDisconnect: () => void;
}

export const Rail = ({ onDisconnect }: Props) => {
  const { t } = useTranslation();

  return (
    <nav className="rail" aria-label={t('app.title')}>
      <span className="rail__brand" aria-hidden="true">
        M
      </span>
      <span className="rail__spacer" />
      <button
        type="button"
        className="rail__item"
        onClick={onDisconnect}
        aria-label={t('header.logout')}
        title={t('header.logout')}
      >
        <LogoutIcon />
      </button>
    </nav>
  );
};
