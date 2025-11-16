import React, { useEffect, useState } from 'react';
import '../assets/CSS/Header.css';
import Logo from '../assets/images/dms-logo-black.png';
import notification_icon_on from '../assets/images/notification_on.png';
import notification_icon from '../assets/images/notification.png';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.roleState.loggedIn);
  const isAdmin = useSelector(state => state.roleState.isAdmin);
  const [notIcon, setNotIcon] = useState(notification_icon_on);
  const [showNotification, setShowNotification] = useState('none');
  const location = useLocation();

  // REMOVE .nav-communities as there is NO more community nav!
  const navBars = ['.nav-incidents', '.nav-announcements', '.nav-medicals', '.nav-donate'];

  const SetActive = (command) => {
    navBars.forEach((bars) => {
      const el = document.querySelector(bars);
      if (!el) return;
      if (bars === command) {
        el.classList.add('nav-active');
      } else {
        el.classList.remove('nav-active');
      }
    });
  };

  useEffect(() => {
    if (navBars.includes(".nav-" + location.pathname.split("/")[1])) SetActive(".nav-" + location.pathname.split("/")[1]);
    else {
      navBars.forEach((bars) => {
        const el = document.querySelector(bars);
        if (el) el.classList.remove('nav-active');
      })
    }
  }, [location.pathname.split("/")]);

  const clickNotification = () => {
    if (notIcon === notification_icon_on) {
      setNotIcon(notification_icon);
      setShowNotification('block');
    } else {
      setNotIcon(notification_icon_on);
      setShowNotification('none');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    navigate('/auth/login');
    window.location.reload();
  };

  return (
    <>
      <div className='main-header'>
        <div>
          <div className="header-navbar">
            <img src={Logo} className='header-logo' alt="DMS logo" />
            <Link to='/'>
              <h1 className='header-text'>Disaster <br className='breakline' />Management System</h1>
            </Link>
            <div className="nav-links">
              <ul>
                {loggedIn && (
                  <>
                    <li className='nav-incidents'>
                      <Link to='/incidents'>Incidents</Link></li>
                    {/* REMOVED COMMUNITY LINK */}
                    <li className='nav-announcements'>
                      <Link to='/announcements'>Announcements</Link></li>
                    <li className='nav-medicals'>
                      <Link to='/medicals'>Medicals</Link></li>
                    <li className='nav-donate'>
                      <Link to='/donate'>Donate</Link></li>
                  </>
                )}
                {!loggedIn && (
                  <li className='nav-login'>
                    <button type="button" className="header-login"
                      onClick={() => {
                        navigate('/auth');
                      }}
                    >Login/Register</button></li>
                )}
                {isAdmin && loggedIn && (
                  <li className='nav-admin'>
                    <Link to='/admin'>Admin</Link></li>
                )}
                {loggedIn && (
                  <li className='nav-logout'>
                    <button type="button" className="header-login"
                      onClick={handleLogout}
                    >LogOut</button></li>
                )}
              </ul>
            </div>
          </div>
          <div className="notification-box" onClick={() => clickNotification()}>
            <img src={notIcon} className='notification' alt="notification" />
          </div>
          <div className="notification-modal" style={{
            display: showNotification
          }}>
            <div className="notification-modal-content">
              <h1 style={{
                textAlign: 'center',
                textDecoration: 'underline'
              }}>Notifications</h1>
              <ul className='notification-list'>
                <li>Notification 1</li>
                <li>Notification 2</li>
                <li>Notification 3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
