import './App.css';
import { AllRoutes } from './routes/AllRoutes';
import ChatbotWidget from './components/ChatbotWidget';
import Footer from './components/Footer'; // should only be imported once for the main footer
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { changeRole, clearRole } from './store/roleSlice';

function App() {
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.roleState.loggedIn);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      dispatch(changeRole(storedRole.split(',')));
    } else {
      dispatch(clearRole());
    }
  }, [dispatch]);

  return (
    <>
      <div className="main-content">
        <AllRoutes />
        {loggedIn && <ChatbotWidget />}
      </div>
      <Footer />
    </>
  );
}

export default App;
