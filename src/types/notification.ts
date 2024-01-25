export enum NotificationLevel {
  Error = 0,
  Info = 1,
  Trace = 2,
}

export interface Notification {
  id: number;
  date: Date;
  visible?: boolean;
  level: NotificationLevel;
  message: string;
}
