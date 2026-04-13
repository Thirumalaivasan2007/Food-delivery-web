/**
 * CraveBites Core Script
 * Shared utilities for the multi-page food app.
 */

const API_BASE_URL = 'https://food-delivery-web-yo3r.onrender.com';

const App = {
    // Auth Check
    checkAuth: (requiredRole = 'customer') => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || (requiredRole && user.role !== requiredRole && user.role !== 'admin')) {
            window.location.href = '/';
            return null;
        }
        return user;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    // Cart Management
    Cart: {
        get: () => JSON.parse(localStorage.getItem('cart') || '[]'),
        add: (item) => {
            const cart = App.Cart.get();
            const existing = cart.find(c => c.id === item.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            App.Cart.updateUI();
        },
        remove: (index) => {
            const cart = App.Cart.get();
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            App.Cart.updateUI();
        },
        clear: () => localStorage.removeItem('cart'),
        getTotal: () => App.Cart.get().reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
        updateUI: () => {
            const countElem = document.getElementById('cart-count');
            if (countElem) {
                const totalItems = App.Cart.get().reduce((sum, item) => sum + (item.quantity || 1), 0);
                countElem.innerText = totalItems;
            }
        }
    },

    // API Helpers
    fetchFoods: async () => {
        const res = await fetch(`${API_BASE_URL}/api/foods`);
        return await res.json();
    },

    createOrder: async (orderData) => {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return await res.json();
    },

    // Tracking Helper
    getOrderStatusStep: (status) => {
        const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
        const index = statuses.indexOf(status);
        return index !== -1 ? index : 0; // Default to 0 for Pending/N/A
    },

    formatDate: (dateInput) => {
        if (!dateInput) return 'N/A';
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    // Geolocation Helper
    reverseGeocode: async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            return data.display_name || 'Address not found';
        } catch (err) {
            console.error("Geocoding error:", err);
            return null;
        }
    }
};

// Initialize Cart UI on any page that has the indicator
document.addEventListener('DOMContentLoaded', () => {
    App.Cart.updateUI();
});
