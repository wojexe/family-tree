import { type Readable, writable } from "svelte/store";

import type { Notification } from "../types/notification";
import { NotificationLevel } from "../types/notification";
const { Error, Info, Trace } = NotificationLevel;

interface ReadableMessages extends Readable<Map<number, Notification>> {
  sendNotification: (level: NotificationLevel, message: string) => void;
  sendError: (message: string) => void;
  sendInfo: (message: string) => void;
  sendTrace: (message: string) => void;
  changeVisibility: (id: number, visible: boolean) => void;
}

const ids = writable(0);

export const createNotifications = (): ReadableMessages => {
  const notifications = writable(new Map<number, Notification>());

  const sendNotification = (level: NotificationLevel, message: string) => {
    let id: number;

    ids.update((value) => {
      id = value;
      return value + 1;
    });

    const date = new Date();

    notifications.update((map) => map.set(id, { id, date, level, message, visible: true }));
  };

  const changeVisibility = (id: number, visible: boolean) => {
    notifications.update((notifs) => {
      if (notifs.has(id) === false) {
        alert("Notification error");
      }

      notifs.get(id).visible = visible;

      return notifs;
    });
  };

  const sendError = (message: string) => sendNotification(Error, message);
  const sendInfo = (message: string) => sendNotification(Info, message);
  const sendTrace = (message: string) => sendNotification(Trace, message);

  const { subscribe } = notifications;

  return {
    subscribe,
    sendNotification,
    sendError,
    sendInfo,
    sendTrace,
    changeVisibility
  };
};
