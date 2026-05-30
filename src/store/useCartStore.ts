import { create } from 'zustand';
import { PocketBaseService } from '../services/pocketbase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: string[];
  specialInstructions?: string;
}

export interface OrderHistoryItem {
  id: string;
  tableNumber: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'none' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'served';
  created: string;
}

interface CartState {
  cart: CartItem[];
  tableNumber: string;
  activeCategory: string;
  searchQuery: string;
  activeTab: 'menu' | 'search' | 'cart' | 'status' | 'report';
  orderStatus: 'none' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'served';
  currentOrderId: string | null;
  isCategoryOpen: boolean;
  isQrScannerOpen: boolean;
  orderHistory: OrderHistoryItem[];
  customer: { name?: string, mobile: string } | null;
  isAuthModalOpen: boolean;
  businessInfo: { name: string; logoUrl: string | null };
  checkoutPending: boolean;
  isOrderingLoading: boolean;
  
  // Actions
  setIsQrScannerOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number, customizations?: string[], specialInstructions?: string) => void;
  removeFromCart: (id: string, customizationsKey?: string) => void;
  updateQuantity: (id: string, quantity: number, customizationsKey?: string) => void;
  clearCart: () => void;
  setTableNumber: (table: string) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: 'menu' | 'search' | 'cart' | 'status' | 'report') => void;
  setOrderStatus: (status: CartState['orderStatus']) => void;
  setCurrentOrderId: (id: string | null) => void;
  setIsCategoryOpen: (open: boolean) => void;
  addOrderToHistory: (order: Omit<OrderHistoryItem, 'created' | 'status'>) => void;
  setCustomer: (customer: { name?: string, mobile: string } | null) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setBusinessInfo: (info: { name: string; logoUrl: string | null }) => void;
  setCheckoutPending: (pending: boolean) => void;
  setIsOrderingLoading: (loading: boolean) => void;
  submitCurrentOrder: () => Promise<void>;
  
  // Getters
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Custom helper to generate unique key for items with different customizations
const getCartItemKey = (id: string, customizations?: string[]) => {
  if (!customizations || customizations.length === 0) return id;
  return `${id}-${[...customizations].sort().join(',')}`;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  tableNumber: new URLSearchParams(window.location.search).get('table') || '',
  activeCategory: 'Breakfast',
  searchQuery: '',
  activeTab: 'menu',
  orderStatus: 'none',
  currentOrderId: null,
  isCategoryOpen: false,
  isQrScannerOpen: false,
  orderHistory: JSON.parse(localStorage.getItem('elevated_order_history') || '[]'),
  customer: JSON.parse(localStorage.getItem('elevated_customer') || 'null'),
  isAuthModalOpen: false,
  businessInfo: { name: 'Elevated', logoUrl: null },
  checkoutPending: false,
  isOrderingLoading: false,

  setIsQrScannerOpen: (isQrScannerOpen) => set({ isQrScannerOpen }),
  addToCart: (item, quantity, customizations = [], specialInstructions = '') => {
    const cart = get().cart;
    const itemKey = getCartItemKey(item.id, customizations);
    
    const existingItemIndex = cart.findIndex(
      (cartItem) => getCartItemKey(cartItem.id, cartItem.customizations) === itemKey
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      if (specialInstructions) {
        updatedCart[existingItemIndex].specialInstructions = specialInstructions;
      }
      set({ cart: updatedCart });
    } else {
      set({
        cart: [...cart, { ...item, quantity, customizations, specialInstructions }]
      });
    }
  },

  removeFromCart: (id, customizationsKey) => {
    const cart = get().cart;
    const updatedCart = cart.filter((cartItem) => {
      const itemKey = getCartItemKey(cartItem.id, cartItem.customizations);
      const targetKey = customizationsKey || id;
      return itemKey !== targetKey;
    });
    set({ cart: updatedCart });
  },

  updateQuantity: (id, quantity, customizationsKey) => {
    if (quantity <= 0) {
      get().removeFromCart(id, customizationsKey);
      return;
    }
    const cart = get().cart;
    const updatedCart = cart.map((cartItem) => {
      const itemKey = getCartItemKey(cartItem.id, cartItem.customizations);
      const targetKey = customizationsKey || id;
      if (itemKey === targetKey) {
        return { ...cartItem, quantity };
      }
      return cartItem;
    });
    set({ cart: updatedCart });
  },

  clearCart: () => set({ cart: [] }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveTab: (activeTab) => set({ activeTab, isCategoryOpen: false }),
  setOrderStatus: (orderStatus) => {
    set({ orderStatus });
    // Dynamic sync inside order history
    const currentOrderId = get().currentOrderId;
    if (currentOrderId) {
      const updatedHistory = get().orderHistory.map((o) =>
        o.id === currentOrderId ? { ...o, status: orderStatus } : o
      );
      set({ orderHistory: updatedHistory });
      localStorage.setItem('elevated_order_history', JSON.stringify(updatedHistory));
    }
  },
  setCurrentOrderId: (currentOrderId) => set({ currentOrderId }),
  setIsCategoryOpen: (isCategoryOpen) => set({ isCategoryOpen }),
  
  addOrderToHistory: (order) => {
    const newOrder: OrderHistoryItem = {
      ...order,
      status: 'pending',
      created: new Date().toISOString()
    };
    const updatedHistory = [newOrder, ...get().orderHistory];
    set({ orderHistory: updatedHistory });
    localStorage.setItem('elevated_order_history', JSON.stringify(updatedHistory));
  },

  setCustomer: (customer) => {
    set({ customer });
    if (customer) {
      localStorage.setItem('elevated_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('elevated_customer');
    }
  },

  setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),
  setBusinessInfo: (businessInfo) => set({ businessInfo }),
  setCheckoutPending: (checkoutPending) => set({ checkoutPending }),
  setIsOrderingLoading: (isOrderingLoading) => set({ isOrderingLoading }),
  submitCurrentOrder: async () => {
    const { cart, tableNumber, getCartTotal, addOrderToHistory, setCurrentOrderId, setOrderStatus, clearCart, setActiveTab } = get();
    if (!tableNumber || cart.length === 0) return;
    
    set({ isOrderingLoading: true });
    try {
      const subtotal = getCartTotal();
      const tax = subtotal * 0.05;
      const grandTotal = subtotal + tax;
      
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
        specialInstructions: item.specialInstructions
      }));

      // Submit order to POS / PocketBase
      const submittedOrder = await PocketBaseService.submitOrder(
        tableNumber,
        orderItems,
        grandTotal
      );

      // Add order details to persistent order history
      addOrderToHistory({
        id: submittedOrder.id,
        tableNumber,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: grandTotal
      });

      // Save order in state
      setCurrentOrderId(submittedOrder.id);
      setOrderStatus('pending');
      clearCart();
      setActiveTab('status'); // Switch to status tracking screen
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    } finally {
      set({ isOrderingLoading: false });
    }
  },

  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  }
}));
