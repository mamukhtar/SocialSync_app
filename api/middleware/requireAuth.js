/**
 * Authentication Middleware
 * 
 * This provides JWT-based authentication middleware for Express routes.
 * It verifies the presence and validity of JWT tokens stored in HTTP-only cookies,
 * protecting routes from unauthorized access.
 */

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

const requireAuth = (req, res, next) => {
    try {
        // Get token from HTTP-only cookie
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token 
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach user ID to request

        next(); // Move to the next middleware

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = requireAuth;