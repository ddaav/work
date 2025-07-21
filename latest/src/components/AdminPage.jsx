import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';

const AdminPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user && user.isadmin) {
            setIsAdmin(true);
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!isAdmin) {
        return null;
    }

    return <AdminDashboard />;
};

export default AdminPage; 