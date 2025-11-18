import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
import { expandRecurringEvents } from "../util";
import { checkReminders, showNotification, requestNotificationPermission } from "../utils/reminders";

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) =>
        evt.id === payload.id ? payload : evt
      );
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}
function normalizeEvent(evt) {
  const base = evt.start ?? evt.day ?? dayjs().valueOf();
  const startTime = dayjs(base);
  const endTime = evt.end
    ? dayjs(evt.end)
    : startTime.add(1, "hour");
  return {
    ...evt,
    start: startTime.valueOf(),
    end: endTime.valueOf(),
    day: startTime.startOf("day").valueOf(),
  };
}

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents.map(normalizeEvent);
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [viewMode, setViewMode] = useState("month");
  const [timeRange, setTimeRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  const filteredEvents = useMemo(() => {
    let labelFiltered = savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      labelFiltered = labelFiltered.filter(
        (evt) =>
          evt.title?.toLowerCase().includes(query) ||
          evt.description?.toLowerCase().includes(query) ||
          evt.location?.toLowerCase().includes(query)
      );
    }
    
    const viewStart = dayjs().month(monthIndex).startOf("month").subtract(1, "month");
    const viewEnd = dayjs().month(monthIndex).endOf("month").add(1, "month");
    
    return expandRecurringEvents(labelFiltered, viewStart, viewEnd);
  }, [savedEvents, labels, monthIndex, searchQuery]);

  useEffect(() => {
    localStorage.setItem(
      "savedEvents",
      JSON.stringify(savedEvents.map(normalizeEvent))
    );
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map(
        (label) => {
          const currentLabel = prevLabels.find(
            (lbl) => lbl.label === label
          );
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        }
      );
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
      setTimeRange(null);
    }
  }, [showEventModal]);

  useEffect(() => {
    requestNotificationPermission();
    const interval = setInterval(() => {
      const triggered = checkReminders(savedEvents);
      triggered.forEach(({ event }) => {
        showNotification(event);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [savedEvents]);

  function updateLabel(label) {
    setLabels(
      labels.map((lbl) => (lbl.label === label.label ? label : lbl))
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        viewMode,
        setViewMode,
        timeRange,
        setTimeRange,
        searchQuery,
        setSearchQuery,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
