import { useTranslation } from 'react-i18next';
import type { ConnectionStatus } from '../features/connection/connectionSlice';

interface Props {
  status: ConnectionStatus;
  /** Renders only a coloured dot (label moves to the title attribute). */
  compact?: boolean;
}

/** Small connection status dot/label. */
export const ConnectionBadge = ({ status, compact = false }: Props) => {
  const { t } = useTranslation();
  const label = t(`connection.status.${status}`);

  if (compact) {
    return (
      <span
        className={`connection-badge connection-badge--compact connection-badge--${status}`}
        title={label}
        aria-label={label}
      >
        <span className="connection-badge__dot" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={`connection-badge connection-badge--${status}`}>
      <span className="connection-badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
};
