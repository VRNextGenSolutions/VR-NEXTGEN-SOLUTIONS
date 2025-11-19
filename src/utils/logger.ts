/**
 * Lightweight logger with safe meta redaction for server-side usage.
 */

export type LogMeta = Record<string, unknown>;

type LogLevel = 'info' | 'warn' | 'error';

const REDACT_KEYS = new Set(['message', 'email', 'token', 'pass', 'password']);

function redactMeta(meta?: LogMeta) {
  if (!meta) return undefined;

  const sanitized: LogMeta = {};

  for (const [key, value] of Object.entries(meta)) {
    if (value === undefined) continue;

    if (typeof value === 'string' && REDACT_KEYS.has(key.toLowerCase())) {
      sanitized[key] = `${value.slice(0, 2)}***`;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[object]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function log(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta: redactMeta(meta),
  };

  // eslint-disable-next-line no-console
  console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](payload);
}

export const logger = {
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
};

export default logger;



