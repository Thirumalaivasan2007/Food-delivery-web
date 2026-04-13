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
    },

    // Recommendation Engine
    getRecommendations: async (cartItems) => {
        const recommendations = [];
        const allFoods = await App.fetchFoods();
        
        const hasBiryani = cartItems.some(item => item.name.toLowerCase().includes('biryani'));
        const hasPizza = cartItems.some(item => item.name.toLowerCase().includes('pizza'));

        if (hasBiryani) {
            const coke = allFoods.find(f => f.name === 'Coke');
            const c65 = allFoods.find(f => f.name === 'Chicken 65');
            if (coke) recommendations.push(coke);
            if (c65) recommendations.push(c65);
        }

        if (hasPizza) {
            const fries = allFoods.find(f => f.name === 'French Fries');
            const pepsi = allFoods.find(f => f.name === 'Pepsi');
            if (fries) recommendations.push(fries);
            if (pepsi) recommendations.push(pepsi);
        }

        // Patch images with high-quality URLs for better aesthetics
        const imageMap = {
            'Coke': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800',
            'Pepsi': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=800',
            'Chicken 65': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800',
            'French Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800'
        };

        recommendations.forEach(item => {
            if (imageMap[item.name]) {
                item.img = imageMap[item.name];
            }
        });

        // Filter out items already in cart
        return recommendations.filter(rec => !cartItems.some(item => (item.id || item._id) === (rec.id || rec._id)));
    }
};

// Initialize Cart UI on any page that has the indicator
document.addEventListener('DOMContentLoaded', () => {
    App.Cart.updateUI();
});
