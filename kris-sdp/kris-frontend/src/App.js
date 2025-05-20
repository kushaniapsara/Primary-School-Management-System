import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Common Components
import Login from './Pages/Common/Login.js';
import Profile from './Pages/Common/Profile.js';
import StudentProfiles from './Pages/Common/StudentProfiles.js';
import Reports from './Pages/Common/Reports.js';
import LeavingCertificateGenerator from './Pages/Common/LeavingCertificateGenerator.js';
// import GoogleSheetPage from './Pages/Common/GoogleSheetPage.js';
import ProgressReport from './Pages/Common/ProgressReport.js';



// Teacher Pages
import TeacherDashboard from './Pages/Teacher/TeacherDashboard.js';
import Attendance from './Pages/Teacher/Attendance.js';
import ExtraAct from './Pages/Teacher/ExtraAct.js';
import ProgressTeacher from './Pages/Teacher/ProgressTeacher.js';
import TeacherProfile from './Pages/Teacher/TeacherProfile.js';
import Homework from './Pages/Teacher/Homework.js';
import StudyMaterials from './Pages/Teacher/StudyMaterials.js';
import ActivityDetails from './Pages/Teacher/ActivityDetails.js';
import ExtraCurricularPage from './Pages/Teacher/ExtraCurricularPage.js';
import ProgressPage from './Pages/Teacher/ProgressPage.js';
import MusicPage from './Pages/Teacher/MusicPage.js';
import ReadingPage from './Pages/Teacher/ReadingPage.js';
import VideosPage from './Pages/Teacher/VideosPage.js';
import GeneralKnowledgePage from './Pages/Teacher/GeneralKnowledgePage.js';

// Parent Pages (role: Student)
import ParentDashboard from './Pages/Parent/ParentDashboard.js';
//import ParentProgress from './Pages/Parent/ParentProgress.js';
import ParentHomework from './Pages/Parent/ParentHomework.js';
import ParentExtraAct from './Pages/Parent/ParentExtraAct.js';
import StudentOwnProgress from './Pages/Parent/StudentOwnProgress.js';
import ParentProfile from './Pages/Parent/ParentProfile.js';
import ParentPayment from './Pages/Parent/ParentPayment.js';


// Admin Pages
import AdminLogin from './Pages/Admin/AdminLogin.js';
import AdminDashboard from './Pages/Admin/AdminDashboard.js';
import StudentManagement from './Pages/Admin/StudentManagement.js';
import TeacherManagement from './Pages/Admin/TeacherManagement.js';
import AdminDetails from './Pages/Admin/AdminDetails.js';
import AdminPayment from './Pages/Admin/AdminPayment.js';

// Navbars
import AdminNavbar from './components/AdminNavbar.js';
import NavbarTeacher from './components/NavbarTeacher.js';
import ParentNavbar from './components/ParentNavbar.js';

const checkAuth = () => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  if (adminToken) {
    try {
      const decoded = jwtDecode(adminToken);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('adminToken');
        return { authenticated: false, role: null };
      }
      return { authenticated: true, role: 'Admin' };
    } catch {
      return { authenticated: false, role: null };
    }
  }

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        return { authenticated: false, role: null };
      }
      return { authenticated: true, role: decoded.role };
    } catch {
      return { authenticated: false, role: null };
    }
  }

  return { authenticated: false, role: null };
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus.authenticated);
    setUserRole(authStatus.role);
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  const renderNavbar = () => {
    if (!isAuthenticated) return null;
    if (userRole === 'Admin') return <AdminNavbar />;
    if (userRole === 'Teacher') return <NavbarTeacher />;
    if (userRole === 'Student') return <ParentNavbar />;
    return null;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Full-Screen Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
  
        {/* Protected Routes with Layout */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <div style={{ width: '240px', backgroundColor: '#f5f5f5' }}>
                  {renderNavbar()}
                </div>
  
                {/* Main Content */}
                <div style={{ flex: 1, padding: '20px' }}>
                  <Routes>
                    {/* Teacher Routes */}
                    <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
                    <Route path="/Attendance" element={<Attendance />} />
                    <Route path="/ExtraAct" element={<ExtraAct />} />
                    <Route path="/ProgressTeacher" element={<ProgressTeacher />} />
                    <Route path="/TeacherProfile" element={<TeacherProfile />} />
                    <Route path="/Homework" element={<Homework />} />
                    <Route path="/StudyMaterials" element={<StudyMaterials />} />
                    <Route path="/activity/:id" element={<ActivityDetails />} />
                    <Route path="/extra-curricular/:studentId" element={<ExtraCurricularPage />} />
                    <Route path="/progress/:studentId" element={<ProgressPage />} />
                    <Route path="/Reports" element={<Reports />} />
  
                    {/* Study Materials */}
                    <Route path="/study-materials/music" element={<MusicPage />} />
                    <Route path="/study-materials/reading" element={<ReadingPage />} />
                    <Route path="/study-materials/videos" element={<VideosPage />} />
                    <Route path="/study-materials/general-knowledge" element={<GeneralKnowledgePage />} />
  
                    {/* Parent Routes */}
                    <Route path="/ParentDashboard" element={<ParentDashboard />} />
                    {/*<Route path="/ParentProgress" element={<ParentProgress />} />*/}
                    <Route path="/ParentHomework" element={<ParentHomework />} />
                    <Route path="/ParentExtraAct" element={<ParentExtraAct />} />
                    <Route path="/StudentOwnProgress" element={<StudentOwnProgress />} />
                    <Route path="/ParentProfile" element={<ParentProfile />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/ParentPayment" element={<ParentPayment />} />


  
                    {/* Admin Routes */}
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    <Route path="/StudentManagement" element={<StudentManagement />} />
                    <Route path="/TeacherManagement" element={<TeacherManagement />} />
                    <Route path="/AdminDetails" element={<AdminDetails />} />
                    <Route path="/AdminPayment" element={<AdminPayment />} />
  
                    {/* Shared Pages */}
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/StudentProfiles" element={<StudentProfiles />} />
                    <Route path="/LeavingCertificateGenerator" element={<LeavingCertificateGenerator />} />
                    {/* <Route path="/class-schedule" element={<GoogleSheetPage />} />  */}
                    {/* need to remove */}
                    <Route path="/ProgressReport" element={<ProgressReport />} />


  
                    {/* Catch-All */}
                    <Route path="*" element={<Navigate to={`/${userRole}Dashboard`} />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;