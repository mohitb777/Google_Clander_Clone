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

function formatHourLabel(hour) {
  return dayjs().hour(hour).minute(0).format("h A");
}

export default function DayView() {
  const {
    daySelected,
    setDaySelected,
    filteredEvents,
    setShowEventModal,
    setSelectedEvent,
    setTimeRange,
    setMonthIndex,
  } = useContext(GlobalContext);

  const currentDay = daySelected || dayjs();
  const timezone = dayjs().format("ZZ");

  const eventsForDay = useMemo(() => {
    return filteredEvents.filter((evt) =>
      dayjs(evt.day).isSame(currentDay, "day")
    );
  }, [filteredEvents, currentDay]);

  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const createEventFromSelection = useCallback(
    (startHour, endHour) => {
      const start = currentDay.startOf("day").add(startHour, "hour");
      const end = currentDay.startOf("day").add(endHour, "hour");
      setDaySelected(start);
      setTimeRange({ start, end });
      setSelectedEvent(null);
      setMonthIndex(start.month());
      setShowEventModal(true);
    },
    [
      currentDay,
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
        createEventFromSelection(selection.startHour, selection.endHour);
      }
      setIsDragging(false);
      setSelection(null);
    }
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [createEventFromSelection, isDragging, selection]);

  function handleSlotMouseDown(hour) {
    setIsDragging(true);
    setSelection({
      startHour: hour,
      endHour: hour + 1,
    });
  }

  function handleSlotMouseEnter(hour) {
    if (!isDragging || !selection) return;
    const newStart = Math.min(selection.startHour, hour);
    const newEnd = Math.max(selection.startHour, hour) + 1;
    setSelection({
      startHour: newStart,
      endHour: newEnd,
    });
  }

  function handleSlotDoubleClick(hour) {
    createEventFromSelection(hour, hour + 1);
  }

  function getEventStyle(evt) {
    const start = dayjs(evt.start ?? evt.day);
    const end = dayjs(evt.end ?? start.add(1, "hour"));
    const offset =
      (start.hour() * 60 + start.minute()) / 60;
    const duration =
      (end.diff(start, "minute") || 60) / 60;
    return {
      top: offset * SLOT_HEIGHT,
      height: Math.max(duration * SLOT_HEIGHT, SLOT_HEIGHT / 2),
    };
  }

  const selectionBox =
    selection && selection.endHour > selection.startHour ? (
      <div
        className="absolute left-2 right-2 bg-blue-100 border border-blue-400 rounded opacity-70 pointer-events-none"
        style={{
          top: selection.startHour * SLOT_HEIGHT,
          height: (selection.endHour - selection.startHour) * SLOT_HEIGHT,
        }}
      />
    ) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-500 border-b bg-white">
        <p>GMT{timezone}</p>
        <p className="text-gray-700 font-semibold">
          {currentDay.format("dddd, MMMM DD, YYYY")}
        </p>
      </div>
      <div className="flex-1 flex overflow-hidden bg-white">
        <div className="w-20 border-r border-gray-100">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-12 text-xs text-right pr-2 text-gray-400"
            >
              {formatHourLabel(hour)}
            </div>
          ))}
        </div>
        <div className="flex-1 relative overflow-y-auto">
          <div
            className="absolute inset-0"
            style={{
              height: `${HOURS.length * SLOT_HEIGHT}px`,
            }}
          >
            {selectionBox}
            {eventsForDay.map((evt) => (
              <div
                key={evt.id}
                className={`absolute left-2 right-2 rounded-lg p-2 text-xs md:text-sm text-white shadow cursor-pointer bg-${evt.label}-500`}
                style={getEventStyle(evt)}
                onClick={() => {
                  setSelectedEvent(evt);
                  setDaySelected(dayjs(evt.start));
                  setTimeRange({
                    start: dayjs(evt.start),
                    end: dayjs(evt.end),
                  });
                  setShowEventModal(true);
                }}
              >
                <p className="font-semibold">{evt.title}</p>
                <p className="text-[11px] text-white/80">
                  {dayjs(evt.start).format("h:mm A")} -{" "}
                  {dayjs(evt.end).format("h:mm A")}
                </p>
              </div>
            ))}
          </div>
          {HOURS.map((hour) => (
            <div
              key={`slot-${hour}`}
              className="h-12 border-b border-gray-100"
              onMouseDown={() => handleSlotMouseDown(hour)}
              onMouseEnter={() => handleSlotMouseEnter(hour)}
              onDoubleClick={() => handleSlotDoubleClick(hour)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

