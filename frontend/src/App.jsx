import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DesktopSidebarLayout from './layouts/DesktopSidebarLayout';
import MobileBottomNavLayout from './layouts/MobileBottomNavLayout';
import Skeleton from './components/ui/Skeleton';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminStaff from './pages/AdminStaff';
import ParentDashboard from './pages/ParentDashboard';
import ParentAttendance from './pages/ParentAttendance';
import ParentFees from './pages/ParentFees';
import ParentProfile from './pages/ParentProfile';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherMarks from './pages/TeacherMarks';
import AdminAdmissions from './pages/AdminAdmissions';
import AdminFinance from './pages/AdminFinance';
import AdminAcademics from './pages/AdminAcademics';
import AdminSettings from './pages/AdminSettings';
import AdminBugs from './pages/AdminBugs';
import AdminManageAccess from './pages/AdminManageAccess';
import LegalPages from './pages/LegalPages';

// Lazy loading pages for PWA performance

function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Notifications */}
      <Toaster position="top-right" />

      <ErrorBoundary>
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-50"><Skeleton className="h-12 w-12 rounded-full" /></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/legal/:policyType" element={<LegalPages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />

            {/* PARENT Routes (Mobile Layout Wrapper) */}
            <Route element={<ProtectedRoute allowedRoles={['Parent']} />}>
              <Route element={<MobileBottomNavLayout />}>
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/parent/attendance" element={<ParentAttendance />} />
                <Route path="/parent/fees" element={<ParentFees />} />
                <Route path="/parent/profile" element={<ParentProfile />} />
              </Route>
            </Route>

            {/* STAFF & ADMIN Routes (Desktop Sidebar Layout Wrapper) */}
            <Route element={<ProtectedRoute allowedRoles={['SuperAdmin', 'Clerk', 'Teacher']} />}>
              <Route element={<DesktopSidebarLayout />}>
                {/* Super Admin */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/admissions" element={<AdminAdmissions />} />
                <Route path="/admin/academics" element={<AdminAcademics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/bugs" element={<AdminBugs />} />
                <Route path="/admin/staff" element={<AdminStaff />} />
                <Route path="/admin/manage-access" element={<AdminManageAccess />} />

                {/* Teacher */}
                <Route path="/teacher/classes" element={<TeacherDashboard />} />
                <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                <Route path="/teacher/marks" element={<TeacherMarks />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
