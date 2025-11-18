import dayjs from "dayjs";

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function expandRecurringEvents(events, startDate, endDate) {
  const expanded = [];
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).endOf("day");

  events.forEach((event) => {
    if (!event.recurrence) {
      expanded.push(event);
      return;
    }

    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);
    const duration = eventEnd.diff(eventStart, "minute");

    let current = eventStart;
    const maxDate = event.recurrence.until
      ? dayjs(event.recurrence.until)
      : end.add(1, "year");

    while (current.isBefore(maxDate) && current.isBefore(end)) {
      if (current.isAfter(start.subtract(1, "day"))) {
        expanded.push({
          ...event,
          start: current.valueOf(),
          end: current.add(duration, "minute").valueOf(),
          day: current.startOf("day").valueOf(),
          isRecurring: true,
          parentId: event.id,
        });
      }

      switch (event.recurrence.frequency) {
        case "daily":
          current = current.add(event.recurrence.interval || 1, "day");
          break;
        case "weekly":
          current = current.add(event.recurrence.interval || 1, "week");
          break;
        case "monthly":
          current = current.add(event.recurrence.interval || 1, "month");
          break;
        case "yearly":
          current = current.add(event.recurrence.interval || 1, "year");
          break;
        default:
          return;
      }
    }
  });

  return expanded;
}