// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = e => {
    e.preventDefault();
    // simulate signup success
    localStorage.setItem('auth', 'true');
    navigate('/dashboard');              // ← navigate here too
  };

  return (
    <div className="page">
      <div className="auth-layout">
        <div className="container auth-card">
          <h2>Create account</h2>
          <p className="muted">Join REXO IOT to get started</p>
          <form onSubmit={handleSignup} className="form">
            <input type="email" value={email}
                   onChange={e => setEmail(e.target.value)}
                   placeholder="Email" required />
            <input type="password" value={password}
                   onChange={e => setPassword(e.target.value)}
                   placeholder="Password" required />
            <button type="submit" className="btn primary">Sign Up</button>
          </form>
          <p className="muted">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
