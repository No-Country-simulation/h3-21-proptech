import PropTypes from "prop-types";
import { useState } from "react";

import homeIcon from "../../../assets/h-icon.svg";
import grafIcon from "../../../assets/g-icon.svg";
import homeIcon2 from "../../../assets/h-icon2.svg";
import grafIcon2 from "../../../assets/g-icon2.svg";

export const Sidebar = ({ setActivePage }) => {
  const [activeIcon, setActiveIcon] = useState("calculator");

  const handleIconClick = (page) => {
    setActivePage(page);
    setActiveIcon(page);
  };

  return (
    <aside className="left-0 w-1/7 top-0 h-full flex items-center">
      <div className="border-2 border-purple-700 text-purple-700 py-2 px-4 ">
        <ul>
          <li
            className={`py-8 px-6 items-center justify-center cursor-pointer  ${
              activeIcon === "home" ? "text-red-500" : ""
            }`}
            onClick={() => handleIconClick("calculator")}
          >
            <img
              src={activeIcon === "calculator" ? homeIcon2 : homeIcon}
              alt="Calculator"
              className="h-7 w-7"
            />
          </li>

          <li
            className={`py-8 px-6 items-center justify-center cursor-pointer  ${
              activeIcon === "graphic" ? "text-blue-500" : ""
            }`}
            onClick={() => handleIconClick("ToggleSection")}
          >
            <img
              src={activeIcon === "ToggleSection" ? grafIcon2 : grafIcon}
              alt="ToggleSection"
              className="h-7 w-7"
            />
          </li>
        </ul>
      </div>
    </aside>
  );
};
Sidebar.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
