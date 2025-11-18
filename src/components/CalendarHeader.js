import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";

export default function CalendarHeader() {
  const {
    monthIndex,
    setMonthIndex,
    daySelected,
    setDaySelected,
    viewMode,
    setViewMode,
  } = useContext(GlobalContext);

  const activeDay = daySelected || dayjs();
  const weekStart = activeDay.subtract(activeDay.day(), "day");
  const weekEnd = weekStart.add(6, "day");
  const title =
    viewMode === "week"
      ? `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D, YYYY")}`
      : dayjs(new Date(dayjs().year(), monthIndex)).format(
          "MMMM YYYY"
        );

  function handlePrev() {
    if (viewMode === "month") {
      setMonthIndex(monthIndex - 1);
      return;
    }
    const newDay = activeDay.subtract(7, "day");
    setDaySelected(newDay);
    setMonthIndex(newDay.month());
  }

  function handleNext() {
    if (viewMode === "month") {
      setMonthIndex(monthIndex + 1);
      return;
    }
    const newDay = activeDay.add(7, "day");
    setDaySelected(newDay);
    setMonthIndex(newDay.month());
  }

  function handleReset() {
    const today = dayjs();
    setDaySelected(today);
    setMonthIndex(today.month());
  }

  function handleViewChange(mode) {
    setViewMode(mode);
    if (mode === "month") {
      setMonthIndex(activeDay.month());
    }
  }

  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-600 font-bold">
        Mohit Planner
      </h1>
      <button
        onClick={handleReset}
        className="border rounded py-2 px-4 mr-5"
      >
        Today
      </button>
      <button onClick={handlePrev}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNext}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-600 font-bold">
        {title}
      </h2>
      <div className="ml-auto flex items-center border rounded-full">
        {["month", "week"].map((mode) => (
          <button
            key={mode}
            onClick={() => handleViewChange(mode)}
            className={`px-4 py-1 text-sm capitalize transition ${
              viewMode === mode
                ? "bg-blue-500 text-white rounded-full"
                : "text-gray-500"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </header>
  );
}
