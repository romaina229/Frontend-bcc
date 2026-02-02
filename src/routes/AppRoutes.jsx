import React from 'react';
import Layout from '../layouts/Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Courses from '../pages/Courses';
import Quiz from '../pages/quiz/QuizPage';
import Forum from '../pages/forum/Forum';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="courses" element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          } />
          
          <Route path="quiz" element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          } />
          
          <Route path="courses/:id" element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          } />
          <Route path="courses/:id/player" element={
            <PrivateRoute>
              <CoursePlayer />
            </PrivateRoute>
          } />
          <Route path="certificates" element={
            <PrivateRoute>
              <Certificates />
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="instructor/dashboard" element={
            <PrivateRoute>
              <InstructorDashboard />
            </PrivateRoute>
          } />

<Route path="forgot-password" element={<ForgotPassword />} />
<Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="forum" element={
            <PrivateRoute>
              <Forum />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;