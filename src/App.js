
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Login';
import Register from './Register';



const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} /> {}
          <Route path="/home" element={<Home />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;


