import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './admin/UserManagement';
import FurnitureManagement from './admin/FurnitureManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout} style={{ float: 'right', marginBottom: '10px' }}>Logout</button>
            <nav>
                <button onClick={() => setActiveTab('users')}>User Management</button>
                <button onClick={() => setActiveTab('furniture')}>Furniture Management</button>
            </nav>
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'furniture' && <FurnitureManagement />}
        </div>
    );
};

export default AdminDashboard; 