import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Pages/Common/Login.js'; // Import the Login component
import TeacherDashboard from './Pages/Teacher/TeacherDashboard.js';
import Attendance from './Pages/Teacher/Attendance.js';
import ExtraActTeacher from './Pages/Teacher/ExtraActTeacher.js';
import ProgressTeacher from './Pages/Teacher/ProgressTeacher.js';
import TeacherProfile from './Pages/Teacher/TeacherProfile.js';
import TeacherHomework from './Pages/Teacher/TeacherHomework.js';
import TeacherStudyMaterials from './Pages/Teacher/TeacherStudyMaterials.js';
import ActivityDetails from './Pages/Teacher/ActivityDetails.js'; // Import the new page


import ParentDashboard from './Pages/Parent/ParentDashboard.js';
import ParentProgress from './Pages/Parent/ParentProgress.js';
import ParentHomework from './Pages/Parent/ParentHomework.js'; 
import ParentExtraAct from './Pages/Parent/ParentExtraAct.js'; 
import ParentPayment from './Pages/Parent/ParentPayment.js'; 
import ParentProfile from './Pages/Parent/ParentProfile.js'; 


function App() {
  const [teacherData, setTeacherData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch teacher dashboard data from backend
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teacher-dashboard');
        setTeacherData(response.data); // Update state with backend data
      } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
      }
    };

    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        setAttendanceData(response.data); // Update state with backend data
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchTeacherData();
    fetchAttendanceData();
  }, []);

  return (
    <div>
    <BrowserRouter>
    <Routes>
        <Route path = '/' element = {<Login/>}> </Route>
              {/* Pass the fetched teacherData as props to TeacherDashboard */}
        <Route path = '/TeacherDashboard' element = {<TeacherDashboard data={teacherData}/>}> </Route>
              {/* Pass the fetched attendanceData as props to Attendance */}
        <Route path = '/Attendance' element = {<Attendance data={attendanceData}/>}> </Route>
        <Route path = '/ExtraActTeacher' element = {<ExtraActTeacher/>}> </Route>
        <Route path = '/ProgressTeacher' element = {<ProgressTeacher/>}> </Route>
        <Route path = '/TeacherProfile' element = {<TeacherProfile/>}> </Route>
        <Route path = '/TeacherHomework' element = {<TeacherHomework/>}> </Route>
        <Route path = '/TeacherStudyMaterials' element = {<TeacherStudyMaterials/>}> </Route>

        <Route path="/activity/:id" element={<ActivityDetails />} /> {/* Dynamic route */}


        <Route path = '/ParentDashboard' element = {<ParentDashboard/>}> </Route>
        <Route path = '/ParentProgress' element = {<ParentProgress/>}> </Route>
        <Route path = '/ParentHomework' element = {<ParentHomework/>}> </Route>
        <Route path = '/ParentExtraAct' element = {<ParentExtraAct/>}> </Route>
        <Route path = '/ParentPayment' element = {<ParentPayment/>}> </Route>
        <Route path = '/ParentProfile' element = {<ParentProfile/>}> </Route>





 
    </Routes>

    </BrowserRouter>
    </div>
  );
}

export default App;
