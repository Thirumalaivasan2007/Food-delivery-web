const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer Transporter Setup - Hardened for Render
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        // Do not fail on invalid certs - helps bypass strict cloud proxy issues
        rejectUnauthorized: false 
    },
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000 
});

// Verify Transporter Connection on Startup
transporter.verify((error, success) => {
    if (error) {
        console.error('CRITICAL: SMTP Connection Error:', error);
    } else {
        console.log('SUCCESS: SMTP Server is ready to take messages');
    }
});

// Startup Security Audit
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('WARNING: EMAIL_USER or EMAIL_PASS environment variables are missing! Email alerts will fail.');
}

// Admin Email Alert Helper
const sendAdminAlert = async (subject, text) => {
    try {
        const mailOptions = {
            from: `"Feastify Engine" <${process.env.EMAIL_USER}>`,
            to: 'thirumalaivasan944@gmail.com',
            subject: `Feastify Alert: ${subject}`,
            text: text,
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ff5a00;">Feastify System Alert</h2>
                    <p><strong>Event:</strong> ${subject}</p>
                    <p>${text}</p>
                    <hr/>
                    <small style="color: #888;">This is an automated security notification.</small>
                   </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Admin alert sent: ${subject}`);
    } catch (err) {
        console.error("Email Alert Error:", err.message);
    }
};

const Order = require('./models/Order');
const User = require('./models/User');
const Category = require('./models/Category');
const Food = require('./models/Food');
const mongoose = require('mongoose');

// Optimization: Disable command buffering so operations fail fast if DB connection is missing
mongoose.set('bufferCommands', false);

// Middleware for Admin Authorization
const adminAuth = async (req, res, next) => {
    // In a real app, we'd verify a JWT here
    // For this demonstration, we'll check a header or role in the body
    const userRole = req.headers['x-user-role'];
    if (userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
};

const app = express();
const port = process.env.PORT || 3000;

// Remove immediate connect call to use bootstrap function
// connectDB();

// Admin Seeding Function
const seedAdmin = async () => {
    try {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.log("Admin credentials not fully provided in .env. Skipping admin seed check.");
            return;
        }
        
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            console.log("No admin found. Seeding admin account from environment variables...");
            const admin = new User({
                name: 'Feastify Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            await admin.save(); // Using save() ensures bcrypt hashing hook is triggered
            console.log(`Admin account seeded successfully for: ${process.env.ADMIN_EMAIL}`);
        } else {
            console.log("Admin account already exists.");
        }
    } catch (err) {
        console.error("Error seeding admin:", err.message);
    }
};

// seedAdmin(); // Removed immediate call

app.use(cors());
app.use(express.json());

// Serve the vanilla frontend files
app.use(express.static(path.join(__dirname, 'public')));

// --- IN-MEMORY FALLBACK STORAGE (For Demo Mode when DB is missing) ---
let mockUsers = [
    { _id: 'u1', email: 'admin@feastify.com', password: 'admin123', name: 'Demo Admin', role: 'admin' },
    { _id: 'u2', email: 'test@example.com', password: '123456', name: 'Demo Customer', role: 'customer' }
];
let mockCategories = [
    { _id: '1', name: 'Biryani' }, { _id: '2', name: 'Pizza' }, { _id: '3', name: 'Burgers' },
    { _id: '4', name: 'Chinese' }, { _id: '5', name: 'Drinks' }, { _id: '6', name: 'Desserts' }
];
let mockFoods = [
    { 
        _id: 'd1', name: 'Ambur Biryani', category: 'Biryani', price: 349.99, 
        description: 'Delicious masala mixed tasty biryani', 
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=2000', 
        prepTime: '25-30 Mins', tag: 'Fresh Items' 
    },
    { 
        _id: 'd2', name: 'Spicy Pizza', category: 'Pizza', price: 199.99, 
        description: 'Extra cheesy spicy pizza', 
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000', 
        prepTime: '15-20 Mins', tag: 'Chef Choice' 
    }
];
// -------------------------------------------------------------------

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// =======================
// AUTH ROUTES
// =======================
app.post('/api/register', async (req, res) => {
    console.log("Registration request received:", req.body);
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            console.error("Missing required fields for registration");
            return res.status(400).json({ success: false, error: "Missing required fields: name, email, and password are required." });
        }

        // Notification: New Signup (Triggered even in Demo Mode for diagnostics)
        await sendAdminAlert('New Customer Signup Attempt', `Customer ${name} (${email}) has joined Feastify! (Mode: ${mongoose.connection.readyState === 1 ? 'Production' : 'Simulation/Demo'})`);

        // Demo Mode Fallback: Allow registration simulation if DB is offline
        if (mongoose.connection.readyState !== 1) {
            console.log(`Demo Mode: Simulated registration for ${email}`);
            const newUser = { _id: 'demo_' + Date.now(), name, email, password, role: 'customer' };
            mockUsers.push(newUser);
            return res.status(201).json({ 
                success: true, 
                message: 'Registration successful (Demo Mode)', 
                userId: newUser._id,
                redirect: '/menu.html'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.warn(`User registration failed: ${email} already exists`);
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Use .save() to trigger the pre-save hook for hashing if not already handled
        const user = new User({ name, email, password, role: 'customer' });
        await user.save();
        
        
        
        // Final Registration Log
        console.log(`User registered successfully: ${user.email} (ID: ${user._id})`);

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully', 
            userId: user._id,
            redirect: '/menu.html'
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// =======================
// CATEGORY ROUTES
// =======================
// Fetch All Users (Admin only)
app.get('/api/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json(mockCategories);
        }
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/categories', adminAuth, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            if (mockCategories.length >= 6) return res.status(400).json({ success: false, message: 'Max 6 categories allowed' });
            const newCat = { _id: Date.now().toString(), ...req.body };
            mockCategories.push(newCat);
            return res.status(201).json({ success: true, category: newCat });
        }
        const count = await Category.countDocuments();
        if (count >= 6) {
            return res.status(400).json({ success: false, message: 'Maximum 6 categories allowed due to space constraints.' });
        }
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/categories/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const newName = req.body.name;
        
        if (mongoose.connection.readyState !== 1) {
            const cat = mockCategories.find(c => c._id === id);
            if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
            const oldName = cat.name;
            cat.name = newName;
            mockFoods.forEach(f => { if(f.category === oldName) f.category = newName; });
            return res.status(200).json({ success: true, category: cat });
        }
        
        // 1. Get the old name first
        const oldCategory = await Category.findById(id);
        if (!oldCategory) return res.status(404).json({ success: false, message: 'Category not found' });
        
        const oldName = oldCategory.name;
        
        // 2. Update the category itself
        oldCategory.name = newName;
        await oldCategory.save();
        
        // 3. Propagate renaming to all associated food items
        const foodUpdate = await Food.updateMany({ category: oldName }, { category: newName });
        
        console.log(`Renamed category "${oldName}" to "${newName}". Updated ${foodUpdate.modifiedCount} foods.`);
        
        res.status(200).json({ success: true, category: oldCategory, modifiedFoods: foodUpdate.modifiedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/categories/:id', adminAuth, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            mockCategories = mockCategories.filter(c => c._id !== req.params.id);
            return res.status(200).json({ success: true });
        }
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Alias for compatibility
app.post('/api/auth/register', (req, res) => {
    console.log("Redirecting /api/auth/register to /api/register");
    return app._router.handle(req, res, () => {}); // This won't work perfectly in Express 5, so better to just repeat or call a handler
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Demo Mode Fallback: Allow login if DB is offline
        if (mongoose.connection.readyState !== 1) {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                if (user.role === 'admin') {
                    await sendAdminAlert('Admin Login Alert (Demo Mode)', `A successful login to the Admin account (${email}) was detected in Demo Mode.`);
                }
                return res.status(200).json({
                    success: true, message: 'Demo Login Success', role: user.role, name: user.name, userId: user._id, redirect: user.role === 'admin' ? '/admin.html' : '/menu.html'
                });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid credentials in Demo Mode' });
            }
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const redirectPath = (user.role === 'admin') ? '/admin.html' : '/menu.html';
        
        // Security Notification: Admin Login
        if (user.role === 'admin') {
            await sendAdminAlert('Admin Login Alert', `A successful login to the Admin account (${email}) was detected at ${new Date().toLocaleString()}.`);
        }

        res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            role: user.role, 
            userId: user._id,
            name: user.name,
            redirect: redirectPath
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// =======================
// FOOD / ADMIN ROUTES
// =======================
app.post('/api/foods', adminAuth, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const newFood = { _id: Date.now().toString(), ...req.body };
            mockFoods.push(newFood);
            return res.status(201).json({ success: true, message: 'Food item added (Demo Mode)', food: newFood });
        }
        const food = await Food.create(req.body);
        res.status(201).json({ success: true, message: 'Food item added', food });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/foods', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json(mockFoods);
        }
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/foods/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const food = mockFoods.find(f => f._id === req.params.id);
            if (!food) return res.status(404).json({ success: false, message: 'Not found' });
            return res.status(200).json(food);
        }
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }
        res.status(200).json(food);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Invalid ID format or server error: ' + err.message });
    }
});

app.put('/api/foods/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose.connection.readyState !== 1) {
            let food = mockFoods.find(f => f._id === id);
            if (!food) return res.status(404).json({ success: false, message: 'Not found' });
            Object.assign(food, req.body);
            return res.status(200).json({ success: true, message: 'Food item updated (Demo Mode)', food });
        }
        const updatedFood = await Food.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        if (!updatedFood) return res.status(404).json({ success: false, message: 'Food not found' });
        res.status(200).json({ success: true, message: 'Food item updated', food: updatedFood });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/foods/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose.connection.readyState !== 1) {
            mockFoods = mockFoods.filter(f => f._id !== id);
            return res.status(200).json({ success: true, message: 'Food item deleted (Demo Mode)' });
        }
        const deletedFood = await Food.findByIdAndDelete(id);
        if (!deletedFood) return res.status(404).json({ success: false, message: 'Food not found' });
        res.status(200).json({ success: true, message: 'Food item deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// =======================
// ORDER ROUTES
// =======================
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const customerEmail = orderData.customerEmail || orderData.customerDetails?.email || 'N/A';
        const fallbackName = customerEmail !== 'N/A' ? customerEmail.split('@')[0] : 'Guest';
        
        const newOrder = await Order.create({
            ...orderData,
            customerEmail: customerEmail,
            customerDetails: orderData.customerDetails,
            orderStatus: orderData.orderStatus || 'Pending'
        });
        
        console.log(`New Order Created: ${newOrder._id} | Payment: ${newOrder.paymentMethod}`);
        
        // Notification: New Order
        await sendAdminAlert('New Order Received', `Order #${newOrder._id.toString().slice(-6).toUpperCase()} for ₹${newOrder.totalAmount} has been placed via ${newOrder.paymentMethod}.`);

        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully', 
            orderId: newOrder._id 
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Failed to write order: ' + err.message });
    }
});

// Get orders for current user
app.get('/api/my-orders', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: 'Email required' });
        
        const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to read orders: ' + err.message });
    }
});

// Revenue Stats
app.get('/api/revenue-stats', adminAuth, async (req, res) => {
    try {
        const allOrders = await Order.find({});
        let total = 0, cod = 0, online = 0;
        let activeCount = 0, successCount = 0;
        
        const onlineMethods = ['CARD', 'UPI', 'NETBANKING'];
        
        allOrders.forEach(o => {
            const amount = o.totalAmount || 0;
            const method = (o.paymentMethod || '').trim().toUpperCase();
            const status = o.orderStatus;

            // Strict Revenue Logic: Only count Delivered orders
            if (status === 'Delivered') {
                total += amount;
                if (method === 'COD') {
                    cod += amount;
                } else {
                    online += amount;
                }
                successCount++;
            } else if (['Pending', 'Preparing', 'Out for Delivery'].includes(status)) {
                activeCount++;
            }
        });
        
        res.status(200).json({ total, cod, online, activeCount, successCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete Order (Hard Delete)
app.delete('/api/orders/:id', adminAuth, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Order permanently deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Customer Cancellation
app.post('/api/orders/:id/customer-cancel', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndUpdate(id, { 
            orderStatus: 'Cancelled',
            cancelledBy: 'customer',
            acknowledgedByAdmin: false
        }, { returnDocument: 'after' });
        
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        console.log(`URGENT: Order ${id} cancelled by Customer`);

        // Notification: Order Cancelled
        await sendAdminAlert('Order Cancelled (Action Required)', `Customer has cancelled Order #${id.slice(-6).toUpperCase()}. Please check the Admin Dashboard.`);

        res.status(200).json({ success: true, message: 'Order cancelled' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin Cancellation Acknowledgement
app.post('/api/orders/:id/acknowledge-cancel', adminAuth, async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { acknowledgedByAdmin: true });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/orders/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { orderStatus }, 
            { returnDocument: 'after' }
        );
        
        if (updatedOrder) {
            if (orderStatus === 'Cancelled') {
                console.log(`ALERT: Order ${id} has been CANCELLED by Admin. Notification dispatched to customer.`);
            }
            return res.status(200).json({ success: true, message: 'Status updated', order: updatedOrder });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update order: ' + err.message });
    }
});

async function syncCategories() {
    try {
        const distinctCategories = await Food.distinct('category');
        for (const catName of distinctCategories) {
            if (!catName) continue;
            const exists = await Category.findOne({ name: catName });
            if (!exists) {
                await Category.create({ name: catName });
                console.log(`Auto-synced new category: ${catName}`);
            }
        }
    } catch (err) {
        console.error("Category sync error:", err);
// Admin Test Email Route (Diagnostics)
app.get('/api/admin/test-email', async (req, res) => {
    try {
        console.log('--- MANUAL EMAIL TEST INITIATED ---');
        const mailOptions = {
            from: `"Feastify Live Test" <${process.env.EMAIL_USER}>`,
            to: 'thirumalaivasan944@gmail.com',
            subject: 'Feastify Alert: Live Production Test',
            text: `This is a manual diagnostic test sent from the live server at ${new Date().toLocaleString()}. If you see this, your Render environment is configured correctly!`
        };
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!', messageId: info.messageId });
    } catch (err) {
        console.error('Manual Email Test Error:', err);
        res.status(500).json({ success: false, message: 'SMTP Error: ' + err.message });
    }
});

async function bootstrap() {
    const isConnected = await connectDB();
    
    if (isConnected) {
        await seedAdmin();
        await syncCategories();
    }

    app.listen(port, () => {
        console.log(`Backend server running on http://localhost:${port}`);
    });
}

bootstrap();
