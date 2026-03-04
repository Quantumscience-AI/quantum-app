import React from 'react';

const HomePage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        🚀 QuantumScienceAI
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>
        Your quantum computing platform is ready!
      </p>
      <div style={{
        background: 'var(--color-surface)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        maxWidth: '500px'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>✅ Setup Complete</h2>
        <ul style={{ 
          textAlign: 'left', 
          color: 'var(--color-text-secondary)',
          listStyle: 'none',
          padding: 0
        }}>
          <li style={{ marginBottom: '8px' }}>✅ Vite running</li>
          <li style={{ marginBottom: '8px' }}>✅ React installed</li>
          <li style={{ marginBottom: '8px' }}>✅ jsqubits loaded</li>
          <li style={{ marginBottom: '8px' }}>✅ All dependencies ready</li>
        </ul>
      </div>
      <p style={{ 
        marginTop: '30px', 
        color: 'var(--color-text-secondary)',
        fontSize: '0.9rem'
      }}>
        Ready to add the full app components!
      </p>
    </div>
  );
};

export default HomePage;
