import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Be Vietnam Pro, sans-serif' } }} />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
