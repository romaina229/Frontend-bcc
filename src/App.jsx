import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from "./components/store/slices/authSlice";
import Layout from './components/layouts/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages lazy loading
const Login = React.lazy(() => import('./components/pages/auth/Login'));
const Register = React.lazy(() => import('./components/pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./components/pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/pages/auth/ResetPassword'));
const Dashboard = React.lazy(() => import('./components/pages/dashboard/Dashboard'));
const Courses = React.lazy(() => import('./components/pages/courses/Courses'));
const CourseDetail = React.lazy(() => import('./components/pages/courses/CourseDetail'));
const CoursePlayer = React.lazy(() => import('./components/pages/courses/CoursePlayer'));
const QuizPage = React.lazy(() => import('./components/pages/quiz/QuizPage'));
const Forum = React.lazy(() => import('./components/pages/forum/Forum'));
const ForumDiscussion = React.lazy(() => import('./components/pages/forum/ForumDiscussion'));
const Certificates = React.lazy(() => import('./components/pages/certificates/Certificates'));
const Profile = React.lazy(() => import('./components/pages/profile/Profile'));
const AdminDashboard = React.lazy(() => import('./components/pages/admin/AdminDashboard'));
const InstructorDashboard = React.lazy(() => import('./components/pages/instructor/InstructorDashboard'));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Vérifiez l'authentification au chargement
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const ProtectedRoute = ({ children, roles = [] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/connexion" replace />;
    }
    
    if (roles.length > 0 && user) {
      const userRoles = user.roles || [];
      const hasRequiredRole = roles.some(role => userRoles.includes(role));
      if (!hasRequiredRole) {
        return <Navigate to="/" replace />;
      }
    }
    
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/connexion" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          <Route path="/mot-de-passe-oublie" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          <Route path="/reinitialiser-mot-de-passe/:token" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
          
          {/* Routes avec layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="cours" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            
            <Route path="cours/:id" element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } />
            
            <Route path="cours/:id/apprendre" element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } />
            
            <Route path="quiz/:id" element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } />
            
            <Route path="quiz/semaine/:week" element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } />
            
            <Route path="forum" element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            } />
            
            <Route path="forum/categorie/:id" element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            } />
            
            <Route path="forum/discussion/:id" element={
              <ProtectedRoute>
                <ForumDiscussion />
              </ProtectedRoute>
            } />
            
            <Route path="certificats" element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            } />
            
            <Route path="profil" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Routes formateur */}
            <Route path="formateur" element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Routes administrateur */}
            <Route path="admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Page non trouvée</p>
              <a href="/" className="btn-primary">
                Retour à l'accueil
              </a>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;