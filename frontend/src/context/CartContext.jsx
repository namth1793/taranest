import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tara_cart') || '[]'); } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tara_cart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  function addItem(product, qty = 1) {
    setItems(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug, unit: product.unit, qty }];
    });
    setIsOpen(true);
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQty(id, qty) {
    if (qty <= 0) return removeItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function clearCart() { setItems([]); }

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
