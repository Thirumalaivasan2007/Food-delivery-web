# Food Delivery App Backend

This project has been upgraded to use MongoDB and structured to serve its frontend via Express.

## Prerequisites
- **Node.js**: Installed on your system.
- **MongoDB**: A local instance running at `mongodb://localhost:27017` or a remote URI updated in the `.env` file.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application
To start the server, run:
```bash
npm start
```
The server will start on [http://localhost:3000](http://localhost:3000).

## Project Structure
- `/public`: Contains all frontend assets (HTML, CSS, JS).
- `/models`: Mongoose schemas for Users, Foods, and Orders.
- `db.js`: Database connection configuration.
- `server.js`: Express server with REST API endpoints.
- `.env`: Environment variables (Port, MongoDB URI).

## Admin Dashboard
Access the admin interface at [http://localhost:3000/admin.html](http://localhost:3000/admin.html).
