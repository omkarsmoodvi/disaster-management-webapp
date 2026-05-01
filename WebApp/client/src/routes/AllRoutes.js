import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import AdminAnnouncements from '../pages/AdminAnnouncements';
import NavigationDemo from '../pages/NavigationDemo';
import Announcements from '../pages/Announcements';
import Donate from '../pages/Donate';
import DonateMoney from '../pages/DonateMoney';
import DonateResource from '../pages/DonateResource';
import AdminDashboard from '../pages/AdminDashboard';
import IncidentsList from '../components/IncidentsList';
import VerifyPage from '../pages/VerifyPage';
import ForgotPassword from '../pages/ForgotPassword';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';

import { Home, MedicalHome } from '../pages';
import { Auth } from '../pages/Auth';
import {
  Header, Map, Medicals, Incidents
} from '../components';

export const AllRoutes = () => {
  const isAdmin = useSelector(state => state.roleState.isAdmin);
  const loggedIn = useSelector(state => state.roleState.loggedIn);
  const location = useLocation();

  const hideHeaderFooter = [
    "/login",
    "/register",
    "/forgot-password"
  ];
  const isAuthPage = hideHeaderFooter.includes(location.pathname) ||
    location.pathname.startsWith("/verify");

  const [myLocation] = useState([23.7264, 90.3925]);
  const locations = [
    { position: [23.7264, 90.3925], popupText: 'Buet' },
    { position: [23.696789, 90.399721], popupText: 'DU' },
    { position: [23.704783, 90.398183], popupText: 'BD' }
  ];

  return (
    <>
      {!isAuthPage && <Header />}
      <Routes>
        {/* Default: Internal dashboard (Home) when logged in, landing page otherwise */}
        <Route path="/" element={loggedIn ? <Home /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Verification */}
        <Route path="/verify/:token" element={<VerifyPage />} />
        {/* Auth (optional) */}
        <Route path="/auth/*" element={!loggedIn ? <Auth /> : <Navigate to="/" />} />

        {/* Main App / Dashboard Feature Routes */}
        <Route path="/home"               element={loggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/map"                element={loggedIn ? <Map locations={locations} /> : <Navigate to="/login" />} />
        <Route path="/navigation"         element={loggedIn ? <NavigationDemo /> : <Navigate to="/login" />} />
        <Route path="/incidents"          element={loggedIn ? <Incidents /> : <Navigate to="/login" />} />
        <Route path="/incidents/list"     element={loggedIn ? <IncidentsList /> : <Navigate to="/login" />} />
        <Route path="/medicals"           element={loggedIn ? <Medicals /> : <Navigate to="/login" />} />
        <Route path="/medical/:id"        element={loggedIn ? <MedicalHome /> : <Navigate to="/login" />} />
        <Route path="/announcements"      element={loggedIn ? <Announcements /> : <Navigate to="/login" />} />

        {/* Donations */}
        <Route path="/donate"             element={loggedIn ? <Donate /> : <Navigate to="/login" />} />
        <Route path="/donate/money"       element={loggedIn ? <DonateMoney /> : <Navigate to="/login" />} />
        <Route path="/donate/resource"    element={loggedIn ? <DonateResource /> : <Navigate to="/login" />} />

        {/* Admin */}
        <Route path="/admin"                element={isAdmin && loggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/announcements"  element={isAdmin && loggedIn ? <AdminAnnouncements /> : <Navigate to="/login" />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 ! Page Not Found</h1>} />
      </Routes>
      {/* Do NOT render <Footer /> here! This is THE CRUCIAL FIX. */}
    </>
  );
};
