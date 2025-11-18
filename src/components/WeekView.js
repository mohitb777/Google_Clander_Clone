import dayjs from "dayjs";
import React, { useContext, useMemo } from "react";
import GlobalContext from "../context/GlobalContext";

export default function WeekView() {
  const {
    daySelected,
    setDaySelected,
    setShowEventModal,
    setSelectedEvent,
    filteredEvents,
    setMonthIndex,
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

  function handleCreate(day) {
    setDaySelected(day);
    setSelectedEvent(null);
    setMonthIndex(day.month());
    setShowEventModal(true);
  }

  function handleSelectEvent(event) {
    setSelectedEvent(event);
    setDaySelected(dayjs(event.day));
    setMonthIndex(dayjs(event.day).month());
    setShowEventModal(true);
  }

  return (
    <div className="flex-1 grid grid-cols-7 border-t border-l bg-white">
      {daysOfWeek.map((day) => {
        const dateKey = day.format("YYYY-MM-DD");
        const events = eventsByDate[dateKey] || [];
        const isToday =
          day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
        const isSelected =
          daySelected &&
          day.format("DD-MM-YY") === daySelected.format("DD-MM-YY");

        return (
          <div
            key={dateKey}
            className="border-r border-b p-3 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase text-gray-500">
                  {day.format("ddd")}
                </p>
                <p
                  className={`text-lg ${
                    isSelected
                      ? "text-blue-600 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {day.format("D")}
                </p>
              </div>
              {isToday && (
                <span className="text-xs text-blue-500 font-semibold">
                  Today
                </span>
              )}
            </div>

            <div
              className="flex-1 space-y-2 cursor-pointer"
              onClick={() => handleCreate(day)}
            >
              {events.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No events. Click to add.
                </p>
              )}
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectEvent(evt);
                  }}
                  className={`bg-${evt.label}-200 border-l-4 border-${evt.label}-500 p-2 rounded shadow-sm text-sm text-gray-700`}
                >
                  <p className="font-semibold">{evt.title}</p>
                  <p className="text-xs text-gray-500">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

