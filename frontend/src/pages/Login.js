// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    // simulate auth success
    localStorage.setItem('auth', 'true');
    navigate('/dashboard');                // ← this must fire
  };

  return (
    <div className="page">
      <div className="auth-layout">
        <div className="auth-visual">
          <div className="cube-scene">
            <div className="cube">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face right"></div>
              <div className="face left"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
        </div>

        <div className="container auth-card">
          <h2>Welcome back</h2>
          <p className="muted">Sign in to manage your water system</p>
          <form onSubmit={handleLogin} className="form">
            <input type="email" value={email}
                   onChange={e => setEmail(e.target.value)}
                   placeholder="Email" required />
            <input type="password" value={password}
                   onChange={e => setPassword(e.target.value)}
                   placeholder="Password" required />
            <button type="submit" className="btn primary">Login</button>
          </form>
          <p className="muted">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
