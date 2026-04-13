const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Set a shorter timeout for local development to avoid long hangs
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, 
        });
        console.log('MongoDB connected successfully');
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('⚠️ Running in Mockup Mode. Install MongoDB locally for full features.');
        return false;
    }
};

module.exports = connectDB;
