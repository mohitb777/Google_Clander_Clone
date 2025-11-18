import React, { useContext } from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";
import GlobalContext from "../context/GlobalContext";
import { downloadICal } from "../utils/ical";

export default function Sidebar() {
  const { savedEvents } = useContext(GlobalContext);

  function handleExport() {
    downloadICal(savedEvents, "mohit-planner-events.ics");
  }

  return (
    <aside className="border-r bg-white p-5 w-72 flex flex-col space-y-8">
      <CreateEventButton />
      <button
        onClick={handleExport}
        className="border p-2 rounded flex items-center justify-center shadow-md hover:shadow-lg text-sm text-gray-700"
      >
        <span className="material-icons-outlined text-sm mr-2">download</span>
        Export to iCal
      </button>
      <SmallCalendar />
      <Labels />
    </aside>
  );
}
