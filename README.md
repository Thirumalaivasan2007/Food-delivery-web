<div align="center">
  <h1>🍔 Feastify - Food Delivery Web App</h1>
  <p>A full-stack, modern food ordering experience powered by Node.js, Express, and MongoDB.</p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</div>

<br />

## ✨ Features

- **🛍️ Complete Ordering System**: Browse categories, add to cart, and checkout seamlessly.
- **🔐 User Authentication**: Secure login and registration for customers and administrators.
- **👨‍💼 Admin Dashboard**: Manage orders, update statuses, add/edit foods, and view revenue analytics.
- **📱 Responsive UI**: Beautifully designed frontend that looks great on all devices.
- **🗄️ MongoDB Database**: Robust data management securely built with Mongoose.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Security**: Bcrypt.js password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (running locally, or use a MongoDB Atlas URI)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Thirumalaivasan2007/Food-delivery-web.git
cd Food-delivery-web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configuration
Make sure your `.env` file is properly configured. Create a `.env` in the root folder with:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/food_app
# Or paste your MongoDB remote URI
```

### 4. Start the Application
Start the server!
```bash
npm start
```

Your app will be live and running on [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```plaintext
C:\Food app
├── models/          # Mongoose database schemas (User, Food, Category, Order)
├── public/          # Client-side web pages, CSS styles, and UI Javascript
├── utils/           # Utility files and helper scripts
├── db.js            # MongoDB database connection configuration
├── server.js        # Main Express routing and server logic
└── package.json     # Node script definitions and dependencies
```

## 🛡️ Admin Access

Our application automatically seeds an initial admin user so you can test out dashboard features immediately:
- **Portal**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
- **Email**: `admin@nexora.com`
- **Password**: `admin123`

---
<div align="center">
  <i>Developed with ❤️ for food lovers.</i>
</div>
