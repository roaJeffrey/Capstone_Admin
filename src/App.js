import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import SidebarLayout from './components/layout/Layout';
import { PageProvider } from './components/layout/Pagecontext';
import Loginpage from './components/pages/Loginpage';
import Dashboardpage from './components/pages/dashboard/Dashboardpage';
import Userpage from './components/pages/user-management/Userpage';
import Leafscanpage from './components/pages/leaf-scans/Leafscanpage';
import Profilepage from './components/pages/Profilepage';
import Addusermodal from './components/pages/user-management/Addusermodal';
import Feedbackpage from './components/pages/feedback/Feedbackpage';
import Viewuserpage from './components/pages/user-management/Viewuserpage';
import Leafviewpage from './components/pages/leaf-scans/Leafviewpage';
import Viewfeedbackpage from './components/pages/feedback/Viewfeedbackpage'

function App() {
    return (
        <AuthProvider>
            <PageProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Public page (No Sidebar) */}
                            <Route path="/" element={<Loginpage />} />
                            
                            {/* Protected routes with SidebarLayout */}
                            <Route
                                element={
                                    <ProtectedRoute>
                                        <SidebarLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="/dashboard" element={<Dashboardpage />} />
                                <Route path="/profile" element={<Profilepage />} />
                                <Route path="/user" element={<Userpage />} />
                                <Route path="/user/view/:user_id" element={<Viewuserpage />} />
                                <Route path="/adduser" element={<Addusermodal />} />
                                <Route path="/leaf" element={<Leafscanpage />} />
                                <Route path="/leaf/view/:leaf_id" element={<Leafviewpage />} />
                                <Route path="/feedback" element={<Feedbackpage />} />
                                <Route path="/feedback/view/:feedback_id" element={<Viewfeedbackpage />} />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </PageProvider>
        </AuthProvider>
    );
}

export default App;
