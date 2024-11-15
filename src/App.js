import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import UserPage from './components/UserSide/UserPage';
import LeafPage from './components/LeafSide/LeafPage';
import SettingsPage from './components/SettingsSide/SettingsPage';  
import ProfilePage from './components/ProfilePage';
import AddUserPage from './components/UserSide/AddUserPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/user" element={<UserPage />} />
          <Route path="/adduser" element={<AddUserPage />} />
          <Route path="/leaf" element={<LeafPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
