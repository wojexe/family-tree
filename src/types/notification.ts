export enum NotificationLevel {
  Error,
  Info,
  Trace
}

export interface Notification {
  id: number;
  date: Date;
  visible?: boolean;
  level: NotificationLevel;
  message: string;
}
