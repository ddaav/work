import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: '700px' }}>
      <h2 style={{ marginBottom: '24px' }}>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/" style={{ color: '#735813' }}>&larr; Back to Home</Link>
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Price</th>
                <th style={th}>Quantity</th>
                <th style={th}>Total</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.name}</td>
                  <td style={td}>Npr {item.price}</td>
                  <td style={td}>{item.quantity}</td>
                  <td style={td}>Npr {Number(item.price) * item.quantity}</td>
                  <td style={td}>
                    <button onClick={() => removeFromCart(item.id)} style={removeBtn}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginBottom: '16px', fontWeight: 600 }}>Grand Total: Npr {total}</div>
          <button onClick={clearCart} style={clearBtn}>Clear Cart</button>
        </>
      )}
    </div>
  );
}

const th = {
  borderBottom: '2px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};
const td = {
  borderBottom: '1px solid #ddd',
  padding: '12px',
};
const removeBtn = {
  padding: '6px 12px',
  background: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
const clearBtn = {
  padding: '10px 20px',
  background: '#735813',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '8px',
}; 