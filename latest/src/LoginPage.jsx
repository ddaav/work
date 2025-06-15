import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Handle login logic here
    console.log('Login attempt:', { email, password });
    alert('Login functionality would be implemented here');
  };

  return (
    <div className="container">
      <div className="login-box">
        <div className="header">
          <h1 className="company-name">Shades Design Furniture</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>
        
        <div className="form">
          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter your password"
            />
          </div>
          
          <button onClick={handleSubmit} className="login-button">
            Sign In
          </button>
        </div>
        
        <div className="footer">
          <a href="#" className="link">Forgot your password?</a>
          <p className="signup-text">
            Don't have an account? <a href="#" className="link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}