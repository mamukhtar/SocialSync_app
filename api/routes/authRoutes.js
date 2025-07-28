/**
 * Authentication Routes Module
 * 
 * This defines all authentication-related API endpoints including:
 * - User registration (/register)
 * - User login (/login)
 * - User logout (/logout)
 * - Current user data (/me)
 **/

const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth'); // Import requireAuth (Authentication middleware)
const { PrismaClient } = require('@prisma/client');       // Import PrismaClient (database access)
const prisma = new PrismaClient();                      // Instantiate PrismaClient (Database client)

const router = express.Router();

// Authentication Routes
router.post('/register', register);  // Register a new user
router.post('/login', login);        // Login user
router.post('/logout', logout);      // Logout user

// /me route to get current authenticated user data
router.get('/me', requireAuth, async (req, res) => {
    try {
      // req.user is set by requireAuth if the token is valid
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        // Only return these non-sensitive fields
        select: { id: true, name: true, email: true }
      });
      if (user) {
        // Return user data if found
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" });
    }
});
  
module.exports = router;
