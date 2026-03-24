/**
 * Main Application Entry Point
 * Acts like the Restaurant Manager who coordinates all operations
 */

const express = require('express');
const app = express();

// Import routers (modular route handlers)
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

// Import custom middleware
const { logger } = require('./middleware/logger');

// ============= BUILT-IN MIDDLEWARE =============
// express.json() - Like a waiter translating customer orders (JSON) into kitchen-readable format
app.use(express.json());

// ============= GLOBAL MIDDLEWARE =============
// Logger middleware - Applied to ALL requests (like a receptionist logging every customer entry)
// This logs every request method and URL for debugging/monitoring
app.use(logger);

// ============= MOUNTING ROUTERS =============
// Instead of putting all routes in this file (which would become messy like a restaurant with no sections),
// we use Express Router to organize routes by resource type (like having separate sections for dining, takeout, catering)
app.use('/products', productRoutes);  // Product-related routes
app.use('/users', userRoutes);        // User-related routes

// ============= ERROR HANDLING =============
// 404 Handler - This catches any requests that don't match any defined routes
// Like a host telling a customer "I'm sorry, we don't have that item on our menu"
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// ============= START SERVER =============
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🏪 Mini Online Store API is running on http://localhost:${PORT}`);
    console.log(`📦 Available endpoints:`);
    console.log(`   GET    /products     - Get all products`);
    console.log(`   GET    /users/:id    - Get user by ID`);
    console.log(`   POST   /users        - Create a new user`);
});