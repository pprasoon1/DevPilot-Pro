import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import MainApp from './components/MainApp';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';

const BACKEND_URL = 'http://localhost:5000'; // External backend URL
// const BACKEND_URL = 'https://devpilot-backend.onrender.com';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [webcontainerInstance, setWebcontainerInstance] = useState(null);
  const [serverUrl, setServerUrl] = useState('');

  // Initialize WebContainer for dynamic app functionality
  useEffect(() => {
    async function initWebContainer() {
      const instance = await WebContainer.boot();
      await instance.mount(files);
      setWebcontainerInstance(instance);

      instance.on('server-ready', (port, url) => {
        setServerUrl(url); // URL for iframe preview
      });
    }
    initWebContainer();
  }, []);

  // Verify token with external backend on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Token is valid') {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/app" /> : <LandingPage />} />
        <Route path="/login" element={<Login backendUrl={BACKEND_URL} onLogin={handleLogin} />} />
        <Route path="/register" element={<Register backendUrl={BACKEND_URL} onRegister={handleLogin} />} />
        <Route
          path="/app"
          element={
            isLoggedIn ? (
              <MainApp
                webcontainerInstance={webcontainerInstance}
                serverUrl={serverUrl}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;