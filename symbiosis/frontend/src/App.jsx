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
import DashboardHome from './pages/admin/DashboardHome';
import StudentsList from './pages/admin/StudentsList';
import StaffList from './pages/admin/StaffList';
import Academics from './pages/admin/Academics';
import Notices from './pages/admin/Notices';
import Gallery from './pages/admin/Gallery';

import Enquiries from './pages/admin/Enquiries';
import Profile from './pages/admin/Profile';
import Settings from './pages/admin/Settings';


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
            <Route index element={<DashboardHome />} />
            <Route path="students" element={<StudentsList />} />
            <Route path="staff" element={<StaffList />} />
            <Route path="academics" element={<Academics />} />
            <Route path="notices" element={<Notices />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
