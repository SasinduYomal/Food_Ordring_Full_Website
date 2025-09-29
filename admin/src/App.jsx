import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ManageMenu from './pages/ManageMenu/ManageMenu';
import ManageOrders from './pages/ManageOrders/ManageOrders';
import ManageReservations from './pages/ManageReservations/ManageReservations';
import ManageUsers from './pages/ManageUsers/ManageUsers';
import ContactMessages from './pages/ContactMessages/ContactMessages';
import Reports from './pages/Reports/Reports';
import Promotions from './pages/Promotions/Promotions';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <Sidebar />
                <main>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/menu" element={<ManageMenu />} />
                    <Route path="/orders" element={<ManageOrders />} />
                    <Route path="/reservations" element={<ManageReservations />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/contact-messages" element={<ContactMessages />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/promotions" element={<Promotions />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;