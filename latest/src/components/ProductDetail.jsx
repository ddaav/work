import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/furniture/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p>{error}</p><Link to="/">Back to Home</Link></div>;
  if (!product) return <div className="container"><p>Product not found.</p><Link to="/">Back to Home</Link></div>;

  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: '600px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#735813', fontWeight: 500 }}>&larr; Back to Home</Link>
      <div className="product-detail-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '32px', marginTop: '24px' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '24px' }} />
        <h2 style={{ marginBottom: '12px', color: '#2c3e50' }}>{product.name}</h2>
        <p style={{ fontSize: '18px', color: '#735813', marginBottom: '8px' }}>Npr {product.price}</p>
        <p style={{ color: '#888', marginBottom: '16px' }}>Category: {product.category}</p>
        {/* Add more product details here if available */}
      </div>
    </div>
  );
} 