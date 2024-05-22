import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', { email, password });
      alert(response.data);
      if (response.status === 200) {
        setEmail('');
        setPassword('');
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user');
    }
  };

  return (
    <div className='bg-image'>
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
