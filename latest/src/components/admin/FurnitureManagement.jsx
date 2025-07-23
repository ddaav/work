import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FurnitureManagement = () => {
    const [furniture, setFurniture] = useState([]);
    const [newFurniture, setNewFurniture] = useState({ name: '', price: '', image: '', category: '' });
    const [editingFurniture, setEditingFurniture] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchFurniture();
    }, []);

    const fetchFurniture = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/furniture');
            if (!response.ok) throw new Error('Failed to fetch furniture');
            const data = await response.json();
            setFurniture(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingFurniture) {
            setEditingFurniture({ ...editingFurniture, [name]: value });
        } else {
            setNewFurniture({ ...newFurniture, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const furnitureData = editingFurniture || newFurniture;
        const url = editingFurniture
            ? `http://localhost:5000/api/furniture/${editingFurniture.id}`
            : 'http://localhost:5000/api/furniture';
        const method = editingFurniture ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(furnitureData)
            });
            if (!response.ok) throw new Error(`Failed to ${editingFurniture ? 'update' : 'add'} furniture`);
            
            setSuccess(`Furniture ${editingFurniture ? 'updated' : 'added'} successfully.`);
            setNewFurniture({ name: '', price: '', image: '', category: '' });
            setEditingFurniture(null);
            fetchFurniture();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (item) => {
        setEditingFurniture(item);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/furniture/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete furniture');
            
            setSuccess('Furniture deleted successfully.');
            fetchFurniture();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Furniture Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <h3>{editingFurniture ? 'Edit Furniture' : 'Add Furniture'}</h3>
                <input type="text" name="name" value={editingFurniture ? editingFurniture.name : newFurniture.name} onChange={handleInputChange} placeholder="Name" required style={styles.input} />
                <input type="number" name="price" value={editingFurniture ? editingFurniture.price : newFurniture.price} onChange={handleInputChange} placeholder="Price" required style={styles.input} />
                <input type="text" name="image" value={editingFurniture ? editingFurniture.image : newFurniture.image} onChange={handleInputChange} placeholder="Image URL" required style={styles.input} />
                <input type="text" name="category" value={editingFurniture ? editingFurniture.category : newFurniture.category} onChange={handleInputChange} placeholder="Category" required style={styles.input} />
                <button type="submit" style={styles.button}>{editingFurniture ? 'Update' : 'Add'}</button>
                {editingFurniture && <button onClick={() => setEditingFurniture(null)} style={{...styles.button, ...styles.cancelButton}}>Cancel</button>}
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Image</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {furniture.map((item) => (
                            <tr key={item.id} style={styles.tr}>
                                <td style={styles.td}>{item.name}</td>
                                <td style={styles.td}>${item.price}</td>
                                <td style={styles.td}>{item.category}</td>
                                <td style={styles.td}><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} /></td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(item)} style={styles.button}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)} style={{...styles.button, ...styles.deleteButton}}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    form: { marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' },
    input: { display: 'block', width: 'calc(100% - 20px)', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' },
    button: { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', marginRight: '10px' },
    deleteButton: { backgroundColor: '#dc3545' },
    cancelButton: { backgroundColor: '#6c757d' },
    th: { borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { borderBottom: '1px solid #ddd', padding: '12px' },
    tr: { '&:hover': { backgroundColor: '#f5f5f5' } }
};

export default FurnitureManagement; 