import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentProblems from './pages/student/Problems';
import StudentAnalytics from './pages/student/Analytics';
import StudentTests from './pages/student/Tests';
import StudentLearning from './pages/student/Learning';
import StudentAssignments from './pages/student/Assignments';
import ProblemSolver from './pages/student/ProblemSolver';
import CourseDetail from './pages/student/CourseDetail';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/courses/:courseId" element={<CourseDetail />} />
        <Route path="/student/problems" element={<StudentProblems />} />
        <Route path="/student/problems/:id" element={<ProblemSolver />} />
        <Route path="/student/analytics" element={<StudentAnalytics />} />
        <Route path="/student/tests" element={<StudentTests />} />
        <Route path="/student/learning" element={<StudentLearning />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />

        {/* Faculty Routes */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
      </Routes>
    </Router>
  );
}
