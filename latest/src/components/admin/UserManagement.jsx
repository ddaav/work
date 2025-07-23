import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                setUsers(users.filter(user => user.id !== userId));
                setSuccess('User deleted successfully.');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingUser)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            const updatedUser = await response.json();
            setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
            setSuccess('User updated successfully.');
            setEditingUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingUser({ ...editingUser, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="user-management-container" style={{ padding: '20px' }}>
            <h2>User Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div className="user-list" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={styles.tr}>
                                <td style={styles.td}>{user.firstName} {user.lastName}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.isAdmin ? 'Admin' : 'User'}</td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(user)} style={styles.button}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} style={{ ...styles.button, ...styles.deleteButton }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <span style={styles.closeButton} onClick={() => setEditingUser(null)}>&times;</span>
                        <h2>Edit User</h2>
                        <form onSubmit={handleUpdate}>
                            <div style={styles.inputGroup}>
                                <label>First Name</label>
                                <input type="text" name="firstName" value={editingUser.firstName} onChange={handleInputChange} style={styles.input} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Last Name</label>
                                <input type="text" name="lastName" value={editingUser.lastName} onChange={handleInputChange} style={styles.input} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label>
                                    <input type="checkbox" name="isAdmin" checked={editingUser.isAdmin} onChange={handleInputChange} />
                                    Admin
                                </label>
                            </div>
                            <button type="submit" style={styles.button}>Update</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    th: {
        borderBottom: '2px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2'
    },
    td: {
        borderBottom: '1px solid #ddd',
        padding: '12px',
    },
    tr: {
        '&:hover': {
            backgroundColor: '#f5f5f5'
        }
    },
    button: {
        padding: '8px 12px',
        marginRight: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white'
    },
    deleteButton: {
        backgroundColor: '#dc3545'
    },
    modal: {
        position: 'fixed',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    modalContent: {
        backgroundColor: '#fefefe',
        margin: '15% auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
        maxWidth: '500px',
        borderRadius: '8px'
    },
    closeButton: {
        color: '#aaa',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    inputGroup: {
        marginBottom: '15px'
    },
    input: {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box'
    }
};

export default UserManagement; 