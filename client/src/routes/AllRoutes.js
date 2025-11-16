import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Home, MedicalHome } from '../pages'; 
import { Auth } from '../pages/Auth';
import {
  Header, Footer, Map, Medicals, Incidents, ImgSlider, Statistics
} from '../components';

import Announcements from '../pages/Announcements';
import Donate from '../pages/Donate';
import IncidentsList from '../components/IncidentsList';
import NavigationDemo from '../pages/NavigationDemo';
import AdminDashboard from '../pages/AdminDashboard';
import VerifyPage from '../pages/VerifyPage';

export const AllRoutes = () => {
  const isAdmin = useSelector(state => state.roleState.isAdmin);
  const loggedIn = useSelector(state => state.roleState.loggedIn);

  const [myLocation, setMyLocation] = useState([23.7264, 90.3925]);
  const locations = [
    { position: [23.7264, 90.3925], popupText: 'Buet' },
    { position: [23.696789, 90.399721], popupText: 'DU' },
    { position: [23.704783, 90.398183], popupText: 'BD' }
  ];

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={loggedIn ? <Map locations={locations} /> : <Navigate to="/auth/login" />} />
        <Route path="/navigation" element={loggedIn ? <NavigationDemo /> : <Navigate to="/auth/login" />} />
        <Route path="/auth/*" element={!loggedIn ? <Auth /> : <Navigate to="/" />} />

        {/* Community-related routes have been fully removed */}

        <Route path='/incidents' element={loggedIn ? <Incidents /> : <Navigate to="/auth/login" />} />
        <Route path='/incidents/list' element={loggedIn ? <IncidentsList /> : <Navigate to="/auth/login" />} />
        <Route path='/medicals' element={loggedIn ? <Medicals /> : <Navigate to="/auth/login" />} />
        <Route path='/medical/:id' element={loggedIn ? <MedicalHome /> : <Navigate to="/auth/login" />} />
        <Route path='/announcements' element={loggedIn ? <Announcements /> : <Navigate to="/auth/login" />} />
        <Route path='/donate' element={loggedIn ? <Donate /> : <Navigate to="/auth/login" />} />
        <Route path='/admin' element={isAdmin && loggedIn ? <AdminDashboard /> : <Navigate to="/auth/login" />} />
        <Route path='/verify/:token' element={<VerifyPage />} />
        <Route path='*' element={<h1>404 ! Page Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
};
