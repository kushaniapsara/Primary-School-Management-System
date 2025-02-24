import React from 'react';
import {Link} from 'react-router-dom';
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/CalendarToday";


const Navbar = () => {
  return(
<div className="bg-white-100 w-64 flex flex-col py-4">
        <div className="flex flex-col items-center mb-6">
        <img src="/assets/b.png" alt="KRIS Logo" className="w-34 h-24 mx-auto mb-2"/>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <DashboardIcon className="mr-2" />
              <Link to = "/TeacherDashboard">Dashboard</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <MenuBookIcon className="mr-2" />
              <Link to = "/StudentManagement">Student Management</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AssignmentIcon className="mr-2" />
              <Link to = "/TeacherHomework">Teacher Management</Link>
            </li>


            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <CalendarTodayIcon className="mr-2" />
              <Link to = "/Attendance">Attendance</Link>
            </li>
           
            
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <BarChartIcon className="mr-2" />
                <Link to = "/ProgressTeacher">Progress</Link>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <GroupIcon className="mr-2" />
                  <Link to = "/ExtraActTeacher">Extra Curricular</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AttachMoneyIcon className="mr-2" />
              <Link to = "/ParentPayment">Payments</Link>
            </li>

            <li className="flex items-center px-4 py-2 hover:bg-blue-200 cursor-pointer">
              <AccountCircleIcon className="mr-2" />
                  <Link to = "/TeacherProfile">Profile</Link>
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

export default Navbar;

