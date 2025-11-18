import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

const OTHER_CALENDARS = [
  { name: "Birthdays", color: "orange", disabled: true },
  { name: "Family", color: "green", disabled: true },
  { name: "Tasks", color: "blue", disabled: true },
];

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500">
        <span>My calendars</span>
      </div>
      <div className="mt-3 space-y-2">
        {labels.length === 0 && (
          <p className="text-gray-400 text-sm">
            Create an event to see labels.
          </p>
        )}
        {labels.map(({ label: lbl, checked }, idx) => (
          <label
            key={idx}
            className="flex items-center justify-between text-sm cursor-pointer"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  updateLabel({ label: lbl, checked: !checked })
                }
                className={`form-checkbox h-4 w-4 text-${lbl}-500 rounded focus:ring-0 cursor-pointer`}
              />
              <span className="ml-3 text-gray-700 capitalize">
                {lbl}
              </span>
            </div>
          </label>
        ))}
      </div>
      <p className="text-xs uppercase tracking-wide text-gray-500 mt-8">
        Other calendars
      </p>
      <div className="mt-3 space-y-2 text-sm text-gray-500">
        {OTHER_CALENDARS.map((item) => (
          <div key={item.name} className="flex items-center">
            <input
              type="checkbox"
              disabled
              className="form-checkbox h-4 w-4 text-gray-300"
            />
            <span className="ml-3">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
