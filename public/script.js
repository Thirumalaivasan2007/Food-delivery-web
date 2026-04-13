/**
 * CraveBites Core Script
 * Shared utilities for the multi-page food app.
 */

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
        const res = await fetch('/api/foods');
        return await res.json();
    },

    createOrder: async (orderData) => {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return await res.json();
    }
};

// Initialize Cart UI on any page that has the indicator
document.addEventListener('DOMContentLoaded', () => {
    App.Cart.updateUI();
});
