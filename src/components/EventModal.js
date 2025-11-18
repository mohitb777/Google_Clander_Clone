import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

const labelsClasses = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
  "yellow",
  "pink",
  "orange",
  "teal",
  "cyan",
  "amber",
];

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    timeRange,
    setTimeRange,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.title : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState(null);
  const [location, setLocation] = useState("");
  const [reminder, setReminder] = useState("30");

  useEffect(() => {
    const startSource = selectedEvent
      ? dayjs(selectedEvent.start)
      : timeRange
        ? timeRange.start
        : daySelected;
    const endSource = selectedEvent
      ? dayjs(selectedEvent.end)
      : timeRange
        ? timeRange.end
        : daySelected.add(1, "hour");
    setStartTime(dayjs(startSource).format("HH:mm"));
    setEndTime(dayjs(endSource).format("HH:mm"));
    setIsAllDay(selectedEvent?.isAllDay || false);
    setRecurrence(selectedEvent?.recurrence || null);
    setLocation(selectedEvent?.location || "");
    setReminder(selectedEvent?.reminder?.toString() || "30");
  }, [selectedEvent, timeRange, daySelected]);

  function handleSubmit(e) {
    e.preventDefault();
    const baseDay = daySelected
      ? daySelected.startOf("day")
      : dayjs().startOf("day");
    const [startHour, startMinutes] = startTime
      .split(":")
      .map((num) => parseInt(num, 10));
    const [endHour, endMinutes] = endTime
      .split(":")
      .map((num) => parseInt(num, 10));
    const startDate = baseDay
      .hour(startHour || 0)
      .minute(startMinutes || 0);
    let endDate = baseDay.hour(endHour || 0).minute(endMinutes || 0);
    if (!endTime || !endTime.includes(":") || !endDate.isAfter(startDate)) {
      endDate = startDate.add(1, "hour");
    }

    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: startDate.startOf("day").valueOf(),
      start: isAllDay ? startDate.startOf("day").valueOf() : startDate.valueOf(),
      end: isAllDay ? endDate.endOf("day").valueOf() : endDate.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      isAllDay,
      recurrence: recurrence || undefined,
      location: location || undefined,
      reminder: parseInt(reminder, 10) || undefined,
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
    setTimeRange(null);
  }
  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-2xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              schedule
            </span>
            <div className="flex flex-col text-sm">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-gray-600">All day</label>
              </div>
              <p className="text-gray-600">
                {daySelected.format("dddd, MMMM DD")}
              </p>
              {!isAllDay && (
                <div className="flex items-center mt-2 space-x-2">
                  <label className="text-gray-400 text-xs uppercase tracking-wide">
                    Start
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="ml-2 border rounded px-2 py-1 text-gray-700"
                    />
                  </label>
                  <label className="text-gray-400 text-xs uppercase tracking-wide">
                    End
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="ml-2 border rounded px-2 py-1 text-gray-700"
                    />
                  </label>
                </div>
              )}
              <div className="mt-2">
                <label className="text-gray-400 text-xs uppercase tracking-wide block mb-1">
                  Repeat
                </label>
                <select
                  value={recurrence?.frequency || "none"}
                  onChange={(e) => {
                    if (e.target.value === "none") {
                      setRecurrence(null);
                    } else {
                      setRecurrence({
                        frequency: e.target.value,
                        interval: 1,
                      });
                    }
                  }}
                  className="border rounded px-2 py-1 text-sm text-gray-700 w-full"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <span className="material-icons-outlined text-gray-400">
              place
            </span>
            <div className="flex items-center">
              <input
                type="text"
                name="location"
                placeholder="Add location"
                value={location}
                className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                onChange={(e) => setLocation(e.target.value)}
              />
              {location && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  title="Open in Google Maps"
                >
                  <span className="material-icons-outlined text-sm">
                    open_in_new
                  </span>
                </a>
              )}
            </div>
            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <textarea
              name="description"
              placeholder="Add a description (supports links: https://example.com)"
              value={description}
              rows={3}
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              notifications
            </span>
            <div className="flex items-center">
              <label className="text-gray-400 text-xs uppercase tracking-wide mr-2">
                Reminder
              </label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="border rounded px-2 py-1 text-sm text-gray-700"
              >
                <option value="0">None</option>
                <option value="5">5 minutes before</option>
                <option value="10">10 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>
            <span className="material-icons-outlined text-gray-400">
              bookmark_border
            </span>
            <div className="flex gap-x-2">
              {labelsClasses.map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span className="material-icons-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex justify-between items-center border-t p-3 mt-5">
          {selectedEvent && (
            <button
              type="button"
              onClick={() => {
                const baseDay = daySelected
                  ? daySelected.startOf("day")
                  : dayjs().startOf("day");
                const [startHour, startMinutes] = startTime
                  .split(":")
                  .map((num) => parseInt(num, 10));
                const [endHour, endMinutes] = endTime
                  .split(":")
                  .map((num) => parseInt(num, 10));
                const startDate = baseDay
                  .hour(startHour || 0)
                  .minute(startMinutes || 0);
                let endDate = baseDay.hour(endHour || 0).minute(endMinutes || 0);
                if (!endTime || !endTime.includes(":") || !endDate.isAfter(startDate)) {
                  endDate = startDate.add(1, "hour");
                }
                const duplicatedEvent = {
                  title: `${title} (Copy)`,
                  description,
                  label: selectedLabel,
                  day: startDate.startOf("day").valueOf(),
                  start: isAllDay ? startDate.startOf("day").valueOf() : startDate.valueOf(),
                  end: isAllDay ? endDate.endOf("day").valueOf() : endDate.valueOf(),
                  id: Date.now(),
                  isAllDay,
                  recurrence: recurrence || undefined,
                  location: location || undefined,
                };
                dispatchCalEvent({ type: "push", payload: duplicatedEvent });
                setShowEventModal(false);
                setTimeRange(null);
              }}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Duplicate
            </button>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
            >
              Save
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
