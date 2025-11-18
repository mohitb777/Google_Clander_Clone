import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";
import WeekView from "./components/WeekView";
import DayView from "./components/DayView";
function App() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const {
    monthIndex,
    showEventModal,
    viewMode,
    setShowEventModal,
    setViewMode,
    setMonthIndex,
    setDaySelected,
  } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "c":
          if (!showEventModal) {
            e.preventDefault();
            setShowEventModal(true);
          }
          break;
        case "escape":
          if (showEventModal) {
            e.preventDefault();
            setShowEventModal(false);
          }
          break;
        case "t":
          e.preventDefault();
          const today = new Date();
          setDaySelected(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
          setMonthIndex(today.getMonth());
          break;
        case "m":
          e.preventDefault();
          setViewMode("month");
          break;
        case "w":
          e.preventDefault();
          setViewMode("week");
          break;
        case "d":
          e.preventDefault();
          setViewMode("day");
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEventModal, setShowEventModal, setViewMode, setMonthIndex, setDaySelected]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}

      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1 overflow-hidden bg-gray-50">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            {viewMode === "week" ? (
              <WeekView />
            ) : viewMode === "day" ? (
              <DayView />
            ) : (
              <Month month={currenMonth} />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
