import dayjs from "dayjs";

export function generateICal(events) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mohit Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  events.forEach((event) => {
    const start = dayjs(event.start);
    const end = dayjs(event.end || start.add(1, "hour"));

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@mohitplanner.com`);
    lines.push(`DTSTART:${start.format("YYYYMMDDTHHmmss")}`);
    lines.push(`DTEND:${end.format("YYYYMMDDTHHmmss")}`);
    lines.push(`SUMMARY:${escapeText(event.title)}`);
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    }
    if (event.location) {
      lines.push(`LOCATION:${escapeText(event.location)}`);
    }
    if (event.recurrence) {
      const rrule = generateRRule(event.recurrence, start);
      if (rrule) {
        lines.push(`RRULE:${rrule}`);
      }
    }
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function escapeText(text) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function generateRRule(recurrence, startDate) {
  const { frequency, interval = 1 } = recurrence;
  return `FREQ=${frequency.toUpperCase()};INTERVAL=${interval}`;
}

export function downloadICal(events, filename = "calendar.ics") {
  const icalContent = generateICal(events);
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

