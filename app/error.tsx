"use client";
import React from 'react';

export default function ErrorPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#d32f2f', marginBottom: '1rem' }}>Configuration Error</h1>
      <p style={{ fontSize: '1.2rem', color: '#444', maxWidth: 500, textAlign: 'center' }}>
        Required environment variables are missing.<br />
        Please check your deployment configuration and ensure all required variables are set.<br />
        If you are the developer, see <code>.env.example</code> for required keys.
      </p>
    </div>
  );
}
