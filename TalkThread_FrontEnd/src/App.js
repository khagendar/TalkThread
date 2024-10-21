import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './logincomponents/login.js';
import GenerateChatApp from '../src/chatApplication/GenerateChatApp.js';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BackgroundComponent from './background/background.js';
import UserRoutes from './Routes/UserRoute.js';
import { AuthProvider } from './Routes/AuthContex.js';
import ForgotPassword from './forgotPassword/forgotpassword.js';
import CreateProfile from './CreateUser/CreateProfile.js';
function AppContent() {
  const location = useLocation();
  const isBackgroundVisible = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <AuthProvider>
      <BackgroundComponent isBackgroundVisible={isBackgroundVisible}>
        <div className="App">
          <ToastContainer />
          <Routes>
            {/* Redirect to Sign In by default */}
            <Route path='/' element={<Navigate to="/signin" />} />

            {/* Public Routes */}
            <Route path='/signin' element={<Login action="Sign In" />} />
            <Route path='/signup' element={<Login action="Sign Up" />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Protected Routes */}
            <Route element={<UserRoutes />}>
              <Route path='/chat' element={<GenerateChatApp />} />
              <Route path="/CreateProfile" element ={<CreateProfile />} />
            </Route>
          </Routes>
        </div>
      </BackgroundComponent>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
