import React, { useEffect, useState } from 'react';

const FurnitureManagement = () => {
    const [furniture, setFurniture] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', image: '', category: '' });

    useEffect(() => {
        fetchFurniture();
    }, []);

    const fetchFurniture = async () => {
        const response = await fetch('http://localhost:5000/api/furniture');
        const data = await response.json();
        setFurniture(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/furniture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        fetchFurniture();
    };

    return (
        <div>
            <h2>Furniture Management</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
                <button type="submit">Add Furniture</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {furniture.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.category}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FurnitureManagement; 