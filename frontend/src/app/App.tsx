import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentProblems from './pages/student/Problems';
import StudentAnalytics from './pages/student/Analytics';
import StudentTests from './pages/student/Tests';
import StudentLearning from './pages/student/Learning';
import StudentAssignments from './pages/student/Assignments';
import MCQTestList from './pages/student/MCQTestList';
import MCQTestRunner from './pages/student/MCQTestRunner';
import CodingTestRunner from './pages/student/CodingTestRunner';
import TheoryTestRunner from './pages/student/TheoryTestRunner';
import ProblemSolver from './pages/student/ProblemSolver';
import CourseDetail from './pages/student/CourseDetail';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyTests from './pages/faculty/FacultyTests';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyReports from './pages/faculty/FacultyReports';
import FacultyActivity from './pages/faculty/FacultyActivity';
import FacultyPermissions from './pages/faculty/Permissions';
import ContentHub from './pages/faculty/ContentHub';
import TestBuilderPage from './pages/faculty/TestBuilderPage';
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import AddStudent from './pages/admin/AddStudent';
import Faculty from './pages/admin/Faculty';
import AddFaculty from './pages/admin/AddFaculty';
import Companies from './pages/admin/Companies';
import Placements from './pages/admin/Placements';
import CompanyDashboard from './pages/company/Dashboard';
import FacultyLayout from './components/faculty/FacultyLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredFeature="dashboard">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/courses" element={
          <ProtectedRoute requiredFeature="courses">
            <StudentCourses />
          </ProtectedRoute>
        } />
        <Route path="/student/courses/:courseId" element={
          <ProtectedRoute requiredFeature="courses">
            <CourseDetail />
          </ProtectedRoute>
        } />
        <Route path="/student/problems" element={
          <ProtectedRoute requiredFeature="problems">
            <StudentProblems />
          </ProtectedRoute>
        } />
        <Route path="/student/problems/:id" element={
          <ProtectedRoute requiredFeature="problems">
            <ProblemSolver />
          </ProtectedRoute>
        } />
        <Route path="/student/problem/:id" element={
          <ProtectedRoute requiredFeature="problems">
            <ProblemSolver />
          </ProtectedRoute>
        } />
        <Route path="/student/analytics" element={
          <ProtectedRoute requiredFeature="reports">
            <StudentAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/student/tests" element={
          <ProtectedRoute requiredFeature="tests">
            <StudentTests />
          </ProtectedRoute>
        } />
        <Route path="/student/tests/mcq" element={
          <ProtectedRoute requiredFeature="tests">
            <MCQTestList />
          </ProtectedRoute>
        } />
        <Route path="/student/tests/mcq/:testId" element={
          <ProtectedRoute requiredFeature="tests">
            <MCQTestRunner />
          </ProtectedRoute>
        } />
        <Route path="/student/tests/coding/:testId" element={
          <ProtectedRoute requiredFeature="tests">
            <CodingTestRunner />
          </ProtectedRoute>
        } />
        <Route path="/student/tests/theory/:testId" element={
          <ProtectedRoute requiredFeature="tests">
            <TheoryTestRunner />
          </ProtectedRoute>
        } />
        <Route path="/student/learning" element={
          <ProtectedRoute requiredFeature="learning">
            <StudentLearning />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments" element={
          <ProtectedRoute requiredFeature="assignments">
            <StudentAssignments />
          </ProtectedRoute>
        } />

        {/* Faculty Routes */}
        <Route path="/faculty/*" element={
          <FacultyLayout>
            <Routes>
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="tests" element={<FacultyTests />} />
              <Route path="tests/:testId/builder" element={<TestBuilderPage />} />
              <Route path="assignments" element={<FacultyAssignments />} />
              <Route path="reports" element={<FacultyReports />} />
              <Route path="activity" element={<FacultyActivity />} />
              <Route path="permissions" element={<FacultyPermissions />} />
              <Route path="content" element={<ContentHub />} />
            </Routes>
          </FacultyLayout>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Admin - Students */}
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/students/add" element={<AddStudent />} />

        {/* Admin - Faculty */}
        <Route path="/admin/faculty" element={<Faculty />} />
        <Route path="/admin/faculty/add" element={<AddFaculty />} />

        {/* Admin - Companies & Placements */}
        <Route path="/admin/companies" element={<Companies />} />
        <Route path="/admin/placements" element={<Placements />} />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
      </Routes>
    </Router>
  );
}
