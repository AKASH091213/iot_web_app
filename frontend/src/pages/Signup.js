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
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email}
               onChange={e => setEmail(e.target.value)}
               placeholder="Email" required />
        <input type="password" value={password}
               onChange={e => setPassword(e.target.value)}
               placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
