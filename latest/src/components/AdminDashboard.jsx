import React, { useState } from 'react';
import UserManagement from './admin/UserManagement';
import FurnitureManagement from './admin/FurnitureManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div>
            <h1>Admin Dashboard</h1>
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