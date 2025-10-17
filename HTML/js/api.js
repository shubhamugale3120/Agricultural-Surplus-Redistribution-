/**
 * 🚀 Agricultural Surplus Redistribution API Client
 * 
 * This file handles all communication between the frontend and backend APIs.
 * It provides a clean interface for making HTTP requests to the Node.js server.
 */

// Base API URL - change this if your server runs on a different port
const API_BASE_URL = 'http://localhost:3000/api';

// Utility function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Utility function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * 🌾 FARMER API FUNCTIONS
 */
const FarmerAPI = {
  // Register a new farmer
  register: async (farmerData) => {
    return apiRequest('/farmers/register', {
      method: 'POST',
      body: JSON.stringify(farmerData)
    });
  },

  // Get all farmers
  getAll: async () => {
    return apiRequest('/farmers');
  }
};

/**
 * 🌱 CROP API FUNCTIONS
 */
const CropAPI = {
  // Add a new crop
  add: async (cropData) => {
    return apiRequest('/crops/add', {
      method: 'POST',
      body: JSON.stringify(cropData)
    });
  },

  // Get all crops
  getAll: async () => {
    return apiRequest('/crops');
  },

  // Get available crops only
  getAvailable: async () => {
    return apiRequest('/crops/available');
  },

  // Update crop status
  updateStatus: async (cropId, status) => {
    return apiRequest(`/crops/${cropId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
};

/**
 * 🛒 BUYER API FUNCTIONS
 */
const BuyerAPI = {
  // Create buyer profile
  create: async (buyerData) => {
    return apiRequest('/buyers', {
      method: 'POST',
      body: JSON.stringify(buyerData)
    });
  },

  // Get all buyers
  getAll: async () => {
    return apiRequest('/buyers');
  },

  // Get specific buyer
  getById: async (buyerId) => {
    return apiRequest(`/buyers/${buyerId}`);
  },

  // Update buyer
  update: async (buyerId, buyerData) => {
    return apiRequest(`/buyers/${buyerId}`, {
      method: 'PUT',
      body: JSON.stringify(buyerData)
    });
  },

  // Delete buyer
  delete: async (buyerId) => {
    return apiRequest(`/buyers/${buyerId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 🤝 NGO API FUNCTIONS
 */
const NGOAPI = {
  // Create NGO profile
  create: async (ngoData) => {
    return apiRequest('/ngos', {
      method: 'POST',
      body: JSON.stringify(ngoData)
    });
  },

  // Get all NGOs
  getAll: async () => {
    return apiRequest('/ngos');
  },

  // Get specific NGO
  getById: async (ngoId) => {
    return apiRequest(`/ngos/${ngoId}`);
  },

  // Update NGO
  update: async (ngoId, ngoData) => {
    return apiRequest(`/ngos/${ngoId}`, {
      method: 'PUT',
      body: JSON.stringify(ngoData)
    });
  },

  // Delete NGO
  delete: async (ngoId) => {
    return apiRequest(`/ngos/${ngoId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 🚚 SELLER API FUNCTIONS
 */
const SellerAPI = {
  // Register seller/transporter
  register: async (sellerData) => {
    return apiRequest('/sellers', {
      method: 'POST',
      body: JSON.stringify(sellerData)
    });
  },

  // Get all sellers
  getAll: async () => {
    return apiRequest('/sellers');
  },

  // Get specific seller
  getById: async (sellerId) => {
    return apiRequest(`/sellers/${sellerId}`);
  },

  // Update seller
  update: async (sellerId, sellerData) => {
    return apiRequest(`/sellers/${sellerId}`, {
      method: 'PUT',
      body: JSON.stringify(sellerData)
    });
  },

  // Delete seller
  delete: async (sellerId) => {
    return apiRequest(`/sellers/${sellerId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 📦 ORDER API FUNCTIONS
 */
const OrderAPI = {
  // Create new order
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // Get specific order
  getById: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Get orders by buyer
  getByBuyer: async (buyerId) => {
    return apiRequest(`/orders/buyer/${buyerId}`);
  }
};

/**
 * 💰 TRANSACTION API FUNCTIONS
 */
const TransactionAPI = {
  // Create transaction from order
  create: async (transactionData) => {
    return apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  },

  // Get all transactions (with pagination)
  getAll: async (page = 1, limit = 10) => {
    return apiRequest(`/transactions?page=${page}&limit=${limit}`);
  },

  // Get specific transaction
  getById: async (transactionId) => {
    return apiRequest(`/transactions/${transactionId}`);
  },

  // Update delivery status
  updateDeliveryStatus: async (transactionId, status) => {
    return apiRequest(`/transactions/${transactionId}/delivery-status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Filter by type (commercial/charity)
  getByType: async (type) => {
    return apiRequest(`/transactions/type/${type}`);
  },

  // Get farmer's transactions
  getByFarmer: async (farmerId) => {
    return apiRequest(`/transactions/farmer/${farmerId}`);
  }
};

/**
 * 🚛 LOGISTICS API FUNCTIONS
 */
const LogisticsAPI = {
  // Create logistics record
  create: async (logisticsData) => {
    return apiRequest('/logistics', {
      method: 'POST',
      body: JSON.stringify(logisticsData)
    });
  },

  // Get all logistics (with pagination)
  getAll: async (page = 1, limit = 10) => {
    return apiRequest(`/logistics?page=${page}&limit=${limit}`);
  },

  // Get specific logistics
  getById: async (logisticsId) => {
    return apiRequest(`/logistics/${logisticsId}`);
  },

  // Get by transaction
  getByTransaction: async (transactionId) => {
    return apiRequest(`/logistics/transaction/${transactionId}`);
  },

  // Update delivery status
  updateStatus: async (logisticsId, status) => {
    return apiRequest(`/logistics/${logisticsId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Update delivery date
  updateDeliveryDate: async (logisticsId, deliveryDate) => {
    return apiRequest(`/logistics/${logisticsId}/delivery-date`, {
      method: 'PUT',
      body: JSON.stringify({ delivery_date: deliveryDate })
    });
  },

  // Filter by status
  getByStatus: async (status) => {
    return apiRequest(`/logistics/status/${status}`);
  },

  // Get seller's deliveries
  getBySeller: async (sellerId) => {
    return apiRequest(`/logistics/seller/${sellerId}`);
  }
};

/**
 * 🔐 AUTHENTICATION FUNCTIONS
 * Note: These are placeholder functions since auth routes aren't fully implemented yet
 */
const AuthAPI = {
  // Login user (placeholder)
  login: async (email, password, role) => {
    // This would typically make a request to /api/auth/login
    // For now, we'll simulate authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { email, role },
          token: 'mock-jwt-token'
        });
      }, 500);
    });
  },

  // Register user (placeholder)
  register: async (userData) => {
    // This would typically make a request to /api/auth/register
    // For now, we'll simulate registration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'User registered successfully'
        });
      }, 500);
    });
  }
};

/**
 * 🏥 HEALTH CHECK FUNCTIONS
 */
const HealthAPI = {
  // Check database connectivity
  checkDB: async () => {
    return apiRequest('/health/db', { method: 'GET' });
  }
};

// Export all API functions
window.API = {
  Farmer: FarmerAPI,
  Crop: CropAPI,
  Buyer: BuyerAPI,
  NGO: NGOAPI,
  Seller: SellerAPI,
  Order: OrderAPI,
  Transaction: TransactionAPI,
  Logistics: LogisticsAPI,
  Auth: AuthAPI,
  Health: HealthAPI
};

// SSE client helper for real-time updates
window.Realtime = {
  connect: (onEvent) => {
    const source = new EventSource(`${API_BASE_URL.replace('/api','')}/api/events`);
    source.onmessage = (e) => {
      try { const evt = JSON.parse(e.data); onEvent && onEvent(evt); } catch (_) {}
    };
    source.onerror = () => { /* auto-reconnect handled by browser */ };
    return source;
  }
};

// Utility functions for common operations
window.Utils = {
  // Show loading spinner
  showLoading: (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = '<div class="text-center">Loading...</div>';
    }
  },

  // Show error message
  showError: (message, elementId = null) => {
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `<div class="text-red-600 text-center">Error: ${message}</div>`;
      }
    } else {
      alert(`Error: ${message}`);
    }
  },

  // Show success message
  showSuccess: (message) => {
    alert(`Success: ${message}`);
  },

  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString();
  },

  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number
  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
};

console.log('🚀 Agricultural Surplus Redistribution API Client loaded successfully!');
console.log('📚 Available APIs:', Object.keys(window.API));

