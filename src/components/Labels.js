import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";

const CALENDAR_GROUPS = [
  { name: "Work", labels: ["blue", "indigo", "purple"] },
  { name: "Personal", labels: ["green", "red", "orange"] },
  { name: "Other", labels: ["gray", "yellow", "pink", "teal", "cyan", "amber"] },
];

const OTHER_CALENDARS = [
  { name: "Birthdays", color: "orange", disabled: true },
  { name: "Family", color: "green", disabled: true },
  { name: "Tasks", color: "blue", disabled: true },
];

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  const [expandedGroups, setExpandedGroups] = useState({});

  function toggleGroup(groupName) {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  }

  function getLabelsForGroup(group) {
    return labels.filter((lbl) => group.labels.includes(lbl.label));
  }

  return (
    <div className="mt-4">
      {CALENDAR_GROUPS.map((group) => {
        const groupLabels = getLabelsForGroup(group);
        const isExpanded = expandedGroups[group.name] !== false;

        if (groupLabels.length === 0 && group.name !== "Other") return null;

        return (
          <div key={group.name} className="mb-6">
            <button
              onClick={() => toggleGroup(group.name)}
              className="flex items-center justify-between w-full text-xs uppercase tracking-wide text-gray-500 mb-2"
            >
              <span>{group.name}</span>
              <span className="material-icons-outlined text-sm">
                {isExpanded ? "expand_less" : "expand_more"}
              </span>
            </button>
            {isExpanded && (
              <div className="mt-2 space-y-2">
                {groupLabels.length === 0 ? (
                  <p className="text-gray-400 text-xs ml-4">
                    No calendars in this group
                  </p>
                ) : (
                  groupLabels.map(({ label: lbl, checked }, idx) => (
                    <label
                      key={idx}
                      className="flex items-center justify-between text-sm cursor-pointer ml-4"
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
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          Other calendars
        </p>
        <div className="mt-2 space-y-2 text-sm text-gray-500">
          {OTHER_CALENDARS.map((item) => (
            <div key={item.name} className="flex items-center ml-4">
              <input
                type="checkbox"
                disabled
                checked
                className="form-checkbox h-4 w-4 text-gray-300"
              />
              <span className="ml-3">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
