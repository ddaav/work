import { useState } from 'react';
import './Register.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Handle registration logic here
    console.log('Registration attempt:', formData);
    alert('Registration functionality would be implemented here');
  };

  return (
    <div className="container">
      <div className="register-box">
        <div className="header">
          <h1 className="company-name">Shades Design Furniture</h1>
          <p className="subtitle">Create your account</p>
        </div>
        
        <div className="form">
          <div className="name-row">
            <div className="input-group half-width">
              <label className="label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="input-group half-width">
              <label className="label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="input-group">
            <label className="label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              placeholder="Create a password"
            />
          </div>
          
          <div className="input-group">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input"
              placeholder="Confirm your password"
            />
          </div>
          
          <button onClick={handleSubmit} className="register-button">
            Create Account
          </button>
        </div>
        
        <div className="footer">
          <p className="login-text">
            Already have an account? <a href="#" className="link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}