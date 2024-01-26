import type { Writable } from "svelte/store";
import { createNotifications } from "../../src/store/notifications";
import {
  type Notification,
  NotificationLevel,
} from "../../src/types/notification";

vi.mock("svelte/store", async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  const writable = actual.writable as Writable<unknown>;

  // HACK: all writable stores are maps currently
  writable.delete = () => {
    writable.set(new Map());
  };

  return { ...actual, writable };
});

test("notifications_sendNotification", async () => {
  const notificationsStore = createNotifications();

  notificationsStore.sendNotification(NotificationLevel.Info, "Test message");

  let notifications = new Map<number, Notification>();
  notificationsStore.subscribe((map) => {
    notifications = map;
  });

  assert.equal(notifications.size, 1, "Notification count is not correct");
  assert.equal(
    notifications?.get(0)?.level,
    NotificationLevel.Info,
    "Notification level is not correct",
  );
  assert.equal(
    notifications?.get(0)?.message,
    "Test message",
    "Notification message is not correct",
  );
});

test("notifications_sendError", async () => {
  const notificationsStore = createNotifications();

  notificationsStore.sendError("Test error message");

  let notifications = new Map<number, Notification>();
  notificationsStore.subscribe((map) => {
    notifications = map;
  });

  assert.equal(notifications.size, 1, "Notification count is not correct");
  assert.equal(
    notifications?.get(0)?.level,
    NotificationLevel.Error,
    "Notification level is not correct",
  );
  assert.equal(
    notifications?.get(0)?.message,
    "Test error message",
    "Notification message is not correct",
  );
});

test("notifications_changeVisibility", async () => {
  const notificationsStore = createNotifications();

  notificationsStore.sendNotification(NotificationLevel.Info, "Test message");
  notificationsStore.changeVisibility(0, false);

  let notifications = new Map<number, Notification>();
  notificationsStore.subscribe((map) => {
    notifications = map;
  });

  assert.equal(
    notifications?.get(0)?.visible,
    false,
    "Notification visibility is not correct",
  );
});

test("notifications_changeVisibility_invalidId", async () => {
  const notificationsStore = createNotifications();

  assert.throws(
    () => notificationsStore.changeVisibility(1, false),
    Error,
    "Notification error",
  );
});
