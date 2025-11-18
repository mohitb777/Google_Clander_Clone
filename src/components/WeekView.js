import dayjs from "dayjs";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import GlobalContext from "../context/GlobalContext";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SLOT_HEIGHT = 48;

export default function WeekView() {
  const {
    daySelected,
    setDaySelected,
    setShowEventModal,
    setSelectedEvent,
    filteredEvents,
    setMonthIndex,
    setTimeRange,
  } = useContext(GlobalContext);

  const currentDay = daySelected || dayjs();
  const weekStart = currentDay.subtract(currentDay.day(), "day");
  const daysOfWeek = Array.from({ length: 7 }).map((_, idx) =>
    weekStart.add(idx, "day")
  );

  const eventsByDate = useMemo(() => {
    return filteredEvents.reduce((acc, evt) => {
      const key = dayjs(evt.day).format("YYYY-MM-DD");
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(evt);
      return acc;
    }, {});
  }, [filteredEvents]);

  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const createEvent = useCallback(
    (day, startHour, endHour) => {
      const start = day.startOf("day").add(startHour, "hour");
      const end = day.startOf("day").add(endHour, "hour");
      setDaySelected(start);
      setTimeRange({ start, end });
      setSelectedEvent(null);
      setMonthIndex(start.month());
      setShowEventModal(true);
    },
    [
      setDaySelected,
      setMonthIndex,
      setSelectedEvent,
      setShowEventModal,
      setTimeRange,
    ]
  );

  useEffect(() => {
    function handleMouseUp() {
      if (isDragging && selection) {
        createEvent(
          dayjs(selection.day),
          selection.startHour,
          selection.endHour
        );
      }
      setIsDragging(false);
      setSelection(null);
    }
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [createEvent, isDragging, selection]);

  function handleSlotMouseDown(day, hour) {
    setIsDragging(true);
    setSelection({
      day: day.toDate(),
      startHour: hour,
      endHour: hour + 1,
    });
  }

  function handleSlotMouseEnter(day, hour) {
    if (!isDragging || !selection) return;
    const dayKey = day.format("YYYY-MM-DD");
    const selectionKey = dayjs(selection.day).format("YYYY-MM-DD");
    if (dayKey !== selectionKey) return;
    const newStart = Math.min(selection.startHour, hour);
    const newEnd = Math.max(selection.startHour, hour) + 1;
    setSelection({
      ...selection,
      startHour: newStart,
      endHour: newEnd,
    });
  }

  function renderEvents(day) {
    const key = day.format("YYYY-MM-DD");
    const events = eventsByDate[key] || [];
    return events.map((evt) => {
      const start = dayjs(evt.start ?? evt.day);
      const end = dayjs(evt.end ?? start.add(1, "hour"));
      const offset =
        (start.hour() * 60 + start.minute()) / 60;
      const duration =
        (end.diff(start, "minute") || 60) / 60;
      return (
        <div
          key={evt.id}
          className={`absolute left-1 right-1 rounded-lg p-2 text-xs md:text-sm text-white shadow cursor-pointer bg-${evt.label}-500`}
          style={{
            top: offset * SLOT_HEIGHT,
            height: Math.max(duration * SLOT_HEIGHT, SLOT_HEIGHT / 2),
          }}
          onClick={() => {
            setSelectedEvent(evt);
            setDaySelected(dayjs(evt.start));
            setTimeRange({
              start: dayjs(evt.start),
              end: dayjs(evt.end),
            });
            setMonthIndex(day.month());
            setShowEventModal(true);
          }}
        >
          <p className="font-semibold">{evt.title}</p>
          <p className="text-[11px] text-white/80">
            {start.format("h:mm A")} - {end.format("h:mm A")}
          </p>
        </div>
      );
    });
  }

  function renderSelectionBox(day) {
    if (
      !selection ||
      dayjs(selection.day).format("YYYY-MM-DD") !==
        day.format("YYYY-MM-DD") ||
      selection.endHour <= selection.startHour
    ) {
      return null;
    }
    return (
      <div
        className="absolute left-1 right-1 bg-blue-100 border border-blue-400 rounded opacity-70 pointer-events-none"
        style={{
          top: selection.startHour * SLOT_HEIGHT,
          height: (selection.endHour - selection.startHour) * SLOT_HEIGHT,
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b text-xs text-gray-500">
        <div className="p-3" />
        {daysOfWeek.map((day) => {
          const isToday = day.isSame(dayjs(), "day");
          return (
            <div
              key={`head-${day}`}
              className="p-3 border-l text-center"
            >
              <p className="uppercase">{day.format("ddd")}</p>
              <p
                className={`text-lg ${
                  isToday ? "text-blue-600 font-bold" : "text-gray-700"
                }`}
              >
                {day.format("D")}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex-1 grid grid-cols-[80px_repeat(7,minmax(0,1fr))] overflow-y-auto">
        <div className="border-r">
          {HOURS.map((hour) => (
            <div
              key={`hour-${hour}`}
              className="h-12 text-xs text-right pr-2 text-gray-400 border-b"
            >
              {dayjs().hour(hour).format("h A")}
            </div>
          ))}
        </div>
        {daysOfWeek.map((day) => (
          <div
            key={`col-${day}`}
            className="relative border-r"
            style={{ minHeight: `${HOURS.length * SLOT_HEIGHT}px` }}
          >
            {renderSelectionBox(day)}
            <div className="absolute inset-0">
              {renderEvents(day)}
            </div>
            {HOURS.map((hour) => (
              <div
                key={`${day}-slot-${hour}`}
                className="h-12 border-b border-gray-100"
                onMouseDown={() => handleSlotMouseDown(day, hour)}
                onMouseEnter={() => handleSlotMouseEnter(day, hour)}
                onDoubleClick={() => createEvent(day, hour, hour + 1)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

