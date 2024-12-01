import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import SidebarLayout from './components/layout/Layout';
import { PageProvider } from './components/layout/PageContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import UserPage from './components/user-management/UserPage';
import LeafPage from './components/leaf-scans/LeafScansPage';
import SettingsPage from './components/settings/SettingsPage';  
import ProfilePage from './components/ProfilePage';
import AddUserPage from './components/user-management/AddUserPage';
import NewPasswordPage from './components/settings/NewPasswordPage';
import FeedbackPage from './components/feedback/FeedbackPage';
import UserViewPage from './components/user-management/UserViewPage';

function App() {
    return (
        <AuthProvider>
            <PageProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Public page (No Sidebar) */}
                            <Route path="/" element={<LoginPage />} />
                            
                            {/* Protected routes with SidebarLayout */}
                            <Route
                                element={
                                    <ProtectedRoute>
                                        <SidebarLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/user" element={<UserPage />} />
                                <Route path="/user/view/:user_id" element={<UserViewPage />} />
                                <Route path="/adduser" element={<AddUserPage />} />
                                <Route path="/leaf" element={<LeafPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/newpassword" element={<NewPasswordPage />} />
                                <Route path="/feedback" element={<FeedbackPage />} />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </PageProvider>
        </AuthProvider>
    );
}

export default App;
