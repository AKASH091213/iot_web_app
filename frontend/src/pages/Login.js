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
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email}
               onChange={e => setEmail(e.target.value)}
               placeholder="Email" required />
        <input type="password" value={password}
               onChange={e => setPassword(e.target.value)}
               placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
