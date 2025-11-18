import dayjs from "dayjs";

export function checkReminders(events) {
  const now = dayjs();
  const triggered = [];

  events.forEach((event) => {
    if (!event.reminder || event.reminder === 0) return;

    const eventStart = dayjs(event.start);
    const reminderTime = eventStart.subtract(event.reminder, "minute");
    const timeDiff = reminderTime.diff(now, "minute");

    if (timeDiff >= 0 && timeDiff < 1 && !event.reminderShown) {
      triggered.push({
        event,
        reminderTime,
      });
    }
  });

  return triggered;
}

export function showNotification(event) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`Reminder: ${event.title}`, {
      body: event.description || `Event starts at ${dayjs(event.start).format("h:mm A")}`,
      icon: "/logo192.png",
      tag: `reminder-${event.id}`,
    });
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

