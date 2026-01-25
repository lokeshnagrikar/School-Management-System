import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import DashboardLayout from './layouts/DashboardLayout';
import PublicGallery from './pages/Gallery';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import DashboardHome from './pages/admin/DashboardHome';
import StudentsList from './pages/admin/StudentsList';
import StaffList from './pages/admin/StaffList';
import UploadMarks from './pages/admin/UploadMarks';
import Academics from './pages/admin/Academics';
import Notices from './pages/admin/Notices';
import Gallery from './pages/admin/Gallery';
import Fees from './pages/admin/Fees';
import Library from './pages/admin/Library';
import Transport from './pages/admin/Transport';
import FeeStructures from './pages/admin/FeeStructures';
import Enquiries from './pages/admin/Enquiries';
import Profile from './pages/admin/Profile';
import Settings from './pages/admin/Settings';
import WebsiteContent from './pages/admin/WebsiteContent';

// Teacher & Student Pages
import MarkAttendance from './pages/teacher/MarkAttendance';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAssignments from './pages/teacher/Assignments';
import StudentAssignments from './pages/student/Assignments';
import StudentFees from './pages/student/Fees';

// Exam Pages (New)
import Exams from './pages/admin/Exams';
import EnterMarks from './pages/teacher/EnterMarks';
import ReportCard from './pages/student/ReportCard';

// RBAC
import AdminRoute from './routes/AdminRoute';
import TeacherRoute from './routes/TeacherRoute';
import StudentRoute from './routes/StudentRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/admissions" element={<Admissions />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/gallery" element={<PublicGallery />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Index redirects based on role */}
            <Route index element={<RoleBasedRedirect />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="students" element={<StudentsList />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="academics" element={<Academics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="fees" element={<Fees />} />
              <Route path="fee-structures" element={<FeeStructures />} />
              <Route path="library" element={<Library />} />
              <Route path="transport" element={<Transport />} />
              <Route path="exams" element={<Exams />} />
              <Route path="content" element={<WebsiteContent />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<TeacherRoute />}>
              <Route path="students" element={<StudentsList />} />
              <Route path="teacher" element={<TeacherDashboard />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="attendance" element={<MarkAttendance />} />
              <Route path="marks" element={<EnterMarks />} />
            </Route>

            {/* Student Routes */}
            <Route element={<StudentRoute />}>
              <Route path="student" element={<StudentDashboard />} />
              <Route path="my-assignments" element={<StudentAssignments />} />
              <Route path="my-fees" element={<StudentFees />} />
              <Route path="my-results" element={<ReportCard />} />
            </Route>

            {/* Common / Shared Routes */}
            <Route path="profile" element={<Profile />} />
            <Route path="notices" element={<Notices />} />
            <Route path="gallery" element={<Gallery />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
