import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null });
  },
  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    }
  }
}));

export const useCartStore = create((set, get) => ({
  items: [],
  initialized: false,
  
  initCart: () => {
    if (typeof window !== 'undefined' && !get().initialized) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        set({ items: JSON.parse(savedCart), initialized: true });
      } else {
        set({ initialized: true });
      }
    }
  },
  
  addItem: (product, size, quantity = 1) => {
    const items = get().items;
    const existingIndex = items.findIndex(
      (item) => item.product._id === product._id && item.size === size
    );
    
    let newItems;
    if (existingIndex > -1) {
      newItems = [...items];
      newItems[existingIndex].quantity += quantity;
    } else {
      newItems = [...items, { product, size, quantity }];
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
    set({ items: newItems });
  },
  
  removeItem: (productId, size) => {
    const newItems = get().items.filter(
      (item) => !(item.product._id === productId && item.size === size)
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
    set({ items: newItems });
  },
  
  updateQuantity: (productId, size, quantity) => {
    const items = get().items;
    const index = items.findIndex(
      (item) => item.product._id === productId && item.size === size
    );
    if (index > -1) {
      const newItems = [...items];
      newItems[index].quantity = quantity;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }
      set({ items: newItems });
    }
  },
  
  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    set({ items: [] });
  },
  
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },
}));
