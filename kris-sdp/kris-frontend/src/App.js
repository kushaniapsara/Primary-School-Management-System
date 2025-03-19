import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Login from './Pages/Common/Login.js'; 
import TeacherDashboard from './Pages/Teacher/TeacherDashboard.js';
import Attendance from './Pages/Teacher/Attendance.js';
import ExtraActTeacher from './Pages/Teacher/ExtraActTeacher.js';
import ProgressTeacher from './Pages/Teacher/ProgressTeacher.js';
import TeacherProfile from './Pages/Teacher/TeacherProfile.js';
import TeacherHomework from './Pages/Teacher/TeacherHomework.js';
import TeacherStudyMaterials from './Pages/Teacher/TeacherStudyMaterials.js';
import ActivityDetails from './Pages/Teacher/ActivityDetails.js';

import ExtraCurricularPage from './Pages/Teacher/ExtraCurricularPage.js';
import ProgressPage from './Pages/Teacher/ProgressPage.js';



import Profile from './Pages/Common/Profile.js';

// Import new pages for study materials
import MusicPage from './Pages/Teacher/MusicPage.js';
import ReadingPage from './Pages/Teacher/ReadingPage.js';
import VideosPage from './Pages/Teacher/VideosPage.js';
import GeneralKnowledgePage from './Pages/Teacher/GeneralKnowledgePage.js';

import ParentDashboard from './Pages/Parent/ParentDashboard.js';
import ParentProgress from './Pages/Parent/ParentProgress.js';
import ParentHomework from './Pages/Parent/ParentHomework.js'; 
import ParentExtraAct from './Pages/Parent/ParentExtraAct.js'; 
import ParentPayment from './Pages/Parent/ParentPayment.js'; 
import ParentProfile from './Pages/Parent/ParentProfile.js';

import AdminLogin from './Pages/Admin/AdminLogin.js'; 
import AdminDashboard from './Pages/Admin/AdminDashboard.js'; 
import StudentManagement from './Pages/Admin/StudentManagement.js'; 
import TeacherManagement from './Pages/Admin/TeacherManagement.js';
import AdminDetails from './Pages/Admin/AdminDetails.js';


import StudentProfiles from './Pages/Common/StudentProfiles.js';


// Utility function to check if the user is authenticated
const checkAuth = () => {
  const token = localStorage.getItem('token');




  const adminToken = localStorage.getItem('adminToken'); // Separate admin token

  if (adminToken) {
    try {
      const decoded = jwtDecode(adminToken);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('adminToken'); // Expired admin token
        return { authenticated: false, role: null };
      }
      return { authenticated: true, role: 'Admin' }; // Admin is logged in
    } catch (error) {
      return { authenticated: false, role: null };
    }
  }






  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('token'); // Token expired
        return { authenticated: false, role: null };
      }
      return { authenticated: true, role: decoded.role }; // Valid token and role
    } catch (error) {
      return { authenticated: false, role: null }; // Invalid token
    }
  }
  return { authenticated: false, role: null }; // No token
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to delay rendering until we check authentication
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus.authenticated);
    setUserRole(authStatus.role);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while the authentication check happens
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path = '/' element = {<Login/>}> </Route>

           <Route path="/" element={isAuthenticated ? <Navigate to={`/${userRole}Dashboard`} /> : <Login />} />

          {/* Teacher Routes */}
          <Route path="/TeacherDashboard" element={isAuthenticated && userRole === 'Teacher' ? <TeacherDashboard /> : <Navigate to="/" />} />
          <Route path="/Attendance" element={isAuthenticated && userRole === 'Teacher' ? <Attendance /> : <Navigate to="/" />} />
          <Route path="/ExtraActTeacher" element={isAuthenticated && userRole === 'Teacher' ? <ExtraActTeacher /> : <Navigate to="/" />} />
          <Route path="/ProgressTeacher" element={isAuthenticated && userRole === 'Teacher' ? <ProgressTeacher /> : <Navigate to="/" />} />
          <Route path="/TeacherProfile" element={isAuthenticated && userRole === 'Teacher' ? <TeacherProfile /> : <Navigate to="/" />} />
          <Route path="/TeacherHomework" element={isAuthenticated && userRole === 'Teacher' ? <TeacherHomework /> : <Navigate to="/" />} />
          <Route path="/TeacherStudyMaterials" element={isAuthenticated && userRole === 'Teacher' ? <TeacherStudyMaterials /> : <Navigate to="/" />} />
          <Route path="/Profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
          <Route path="/activity/:id" element={isAuthenticated && userRole === 'Teacher' ? <ActivityDetails /> : <Navigate to="/" />} />
          <Route path="/StudentProfiles" element={isAuthenticated && userRole === 'Teacher' ? <StudentProfiles /> : <Navigate to="/" />} />
          <Route path="/extra-curricular/:studentId" element={isAuthenticated && userRole === 'Teacher' ? <ExtraCurricularPage /> : <Navigate to="/" />} />
          <Route path="/progress/:studentId" element={isAuthenticated && userRole === 'Teacher' ?<ProgressPage />: <Navigate to="/" />} />





          {/* Routes for Study Material Pages */}
          <Route path="/study-materials/music" element={isAuthenticated && userRole === 'Teacher' ? <MusicPage /> : <Navigate to="/" />} />
          <Route path="/study-materials/reading" element={isAuthenticated && userRole === 'Teacher' ? <ReadingPage /> : <Navigate to="/" />} />
          <Route path="/study-materials/videos" element={isAuthenticated && userRole === 'Teacher' ? <VideosPage /> : <Navigate to="/" />} />
          <Route path="/study-materials/general-knowledge" element={isAuthenticated && userRole === 'Teacher' ? <GeneralKnowledgePage /> : <Navigate to="/" />} />

          {/* Parent Routes */}
         {/* <Route path="/" element={isAuthenticated ? <Navigate to={`/${userRole}Dashboard`} /> : <Login />} /> */}

          <Route path="/ParentDashboard" element={isAuthenticated && userRole === 'Student' ? <ParentDashboard /> : <Navigate to="/" />} />
          <Route path="/ParentProgress" element={isAuthenticated && userRole === 'Student' ? <ParentProgress /> : <Navigate to="/" />} />
          <Route path="/ParentHomework" element={isAuthenticated && userRole === 'Student' ? <ParentHomework /> : <Navigate to="/" />} />
          <Route path="/ParentExtraAct" element={isAuthenticated && userRole === 'Student' ? <ParentExtraAct /> : <Navigate to="/" />} />
          <Route path="/ParentPayment" element={isAuthenticated && userRole === 'Student' ? <ParentPayment /> : <Navigate to="/" />} />
          <Route path="/ParentProfile" element={isAuthenticated && userRole === 'Student' ? <ParentProfile /> : <Navigate to="/" />} />



          {/*<Route path="/AdminLogin" element={isAuthenticated ? <Navigate to={`/AdminDashboard`} /> : <AdminLogin />} />*/}


          {/* Admin Routes */}
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminDashboard" element={isAuthenticated && userRole === 'Admin' ? <AdminDashboard /> : <Navigate to="/AdminLogin" />} />
          <Route path="/StudentManagement" element={isAuthenticated && userRole === 'Admin' ? <StudentManagement /> : <Navigate to="/AdminLogin" />} />
          <Route path="/TeacherManagement" element={isAuthenticated && userRole === 'Admin' ? <TeacherManagement /> : <Navigate to="/AdminLogin" />} />
          <Route path="/AdminDetails" element={isAuthenticated && userRole === 'Admin' ? <AdminDetails /> : <Navigate to="/AdminLogin" />} />
          <Route path="/StudentProfiles" element={isAuthenticated && userRole === 'Teacher' ? <StudentProfiles /> : <Navigate to="/" />} />



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
