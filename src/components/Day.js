import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    daySelected,
    setTimeRange,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    const format = "DD-MM-YY";
    const matchedToday = day.format(format) === dayjs().format(format);
    const matchedSelected =
      daySelected &&
      day.format(format) === daySelected.format(format);

    if (matchedToday) {
      return "bg-blue-600 text-white rounded-full w-7";
    }
    if (matchedSelected) {
      return "bg-blue-100 text-blue-600 rounded-full w-7";
    }
    return "";
  }
  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setTimeRange(null);
          setShowEventModal(true);
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(evt);
              setDaySelected(dayjs(evt.start));
              setTimeRange({
                start: dayjs(evt.start),
                end: dayjs(evt.end),
              });
              setShowEventModal(true);
            }}
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}
