import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = typeof window !== 'undefined' && localStorage.getItem('auth') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <div className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">REXO IOT</Link>
      </div>
      <div className="nav-right">
        {!isAuthed && (
          <>
            {location.pathname !== '/' && <Link className="nav-link" to="/">Login</Link>}
            {location.pathname !== '/signup' && <Link className="nav-link" to="/signup">Sign Up</Link>}
          </>
        )}
        {isAuthed && (
          <>
            {location.pathname !== '/dashboard' && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
            <button className="btn small" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Navbar />
        <div className="route-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
