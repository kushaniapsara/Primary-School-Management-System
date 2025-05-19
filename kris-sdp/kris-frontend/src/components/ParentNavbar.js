import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { NavLink } from 'react-router-dom';


const ParentNavbar = () => {
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Custom function to apply active styling
  const linkClasses = ({ isActive }) =>
  `flex items-center px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 
   ${isActive 
      ? 'bg-blue-800 text-white font-semibold shadow-md' 
      : 'hover:bg-blue-200 text-gray-700'
   }`;

  return(
<div className="bg-white-100 w-66 flex flex-col py-4">
{/* Username at top-right */}
<div className="absolute top-15 right-12 text-xl font-semibold text-gray-700">
        {username ? `👋 ${username}` : ""}
      </div>
        <div className="flex flex-col items-center mb-6">
        <img src="/assets/b.png" alt="KRIS Logo" className="w-34 h-24 mx-auto mb-2"/>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
            <NavLink to="/ParentDashboard" className={linkClasses}>
              <DashboardIcon className="mr-2" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/Homework" className={linkClasses}>
              <AssignmentIcon className="mr-2" />
              Homework
            </NavLink>
          </li>

          <li>
            <NavLink to="/StudyMaterials" className={linkClasses}>
              <MenuBookIcon className="mr-2" />
              Study Materials
            </NavLink>
          </li>

          <li>
            <NavLink to="/ParentExtraAct" className={linkClasses}>
              <GroupIcon className="mr-2" />
              Extra Curricular
            </NavLink>
          </li>

          <li>
            <NavLink to="/StudentOwnProgress" className={linkClasses}>
              <BarChartIcon className="mr-2" />
              Progress
            </NavLink>
          </li>

          <li>
            <NavLink to="/ParentPayment" className={linkClasses}>
              <AttachMoneyIcon className="mr-2" />
              Payment
            </NavLink>
          </li>

          <li>
            <NavLink to="/Profile" className={linkClasses}>
              <AccountCircleIcon className="mr-2" />
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/ProgressReport" className={linkClasses}>
              <AssessmentIcon className="mr-2" />
              Reports
            </NavLink>
          </li>
          </ul>
        </nav>
      </div>

  
  );
};

export default ParentNavbar;

