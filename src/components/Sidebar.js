import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";

export default function Sidebar() {
  return (
    <aside className="border-r bg-white p-5 w-72 flex flex-col space-y-8">
      <CreateEventButton />
      <SmallCalendar />
      <Labels />
    </aside>
  );
}
