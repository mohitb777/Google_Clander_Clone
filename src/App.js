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
  const { monthIndex, showEventModal, viewMode } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

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
