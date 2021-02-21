export type LogMessageData = Record<string, unknown>;

export enum LogLevel {
  debug = 'debug',
  info = 'info',
  notice = 'notice',
  warning = 'warning',
  error = 'error',
  crit = 'crit',
  alert = 'alert',
  emerg = 'emerg',
}

export interface LoggerInterface {
  debug(message: string, data?: LogMessageData): void;
  info(message: string, data?: LogMessageData): void;
  notice(message: string, data?: LogMessageData): void;
  warning(message: string, data?: LogMessageData): void;
  error(message: string, data?: LogMessageData): void;
  crit(message: string, data?: LogMessageData): void;
  alert(message: string, data?: LogMessageData): void;
  emerg(message: string, data?: LogMessageData): void;
}
