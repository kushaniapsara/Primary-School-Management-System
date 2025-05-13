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


const ParentNavbar = () => {
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  return(
<div className="bg-white-100 w-64 flex flex-col py-4">
{/* Username at top-right */}
<div className="absolute top-12 right-12 text-xl font-semibold text-gray-700">
        {username ? `👋 ${username}` : ""}
      </div>
        <div className="flex flex-col items-center mb-6">
        <img src="/assets/b.png" alt="KRIS Logo" className="w-34 h-24 mx-auto mb-2"/>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <DashboardIcon className="mr-2" />
              <Link to = "/ParentDashboard">Dashboard</Link>
            </li>
            {/* <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <BarChartIcon className="mr-2" />
                <Link to = "/ProgressPage">Progress</Link>
            </li> */}
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AssignmentIcon className="mr-2" />
              <Link to = "/TeacherHomework">Homework</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <MenuBookIcon className="mr-2" />
              <Link to = "/StudyMaterials">Study Materials</Link>
            </li>


            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <GroupIcon className="mr-2" />
                  <Link to = "/ParentExtraAct">Extra Curricular</Link>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AttachMoneyIcon className="mr-2" />
              <Link to = "/StudentOwnProgress">Progress</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AttachMoneyIcon className="mr-2" />
              <Link to = "/ParentPayment">Payment</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AccountCircleIcon className="mr-2" />
                  <Link to = "/Profile">Profile</Link>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AssessmentIcon className="mr-2" />
              <Link to = "/Reports">Reports</Link>

            </li>
          </ul>
        </nav>
      </div>

  
  );
};

export default ParentNavbar;

