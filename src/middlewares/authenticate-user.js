import jwt from 'jsonwebtoken'
import UserRepository from '../repositories/user-repository.js'

const UserRepo = new UserRepository()

/**
 * Verify JWT from cookie middleware
 * For stateless authentication using cookies
 */
const authenticateUser = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                status: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await UserRepo.getUserById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                status: false, 
                message: 'Invalid token. User not found.' 
            });
        }

        // Add user to request object
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                status: false, 
                message: 'Invalid token.' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: false, 
                message: 'Token expired.' 
            });
        }
        
        return res.status(500).json({ 
            status: false, 
            message: 'Authentication failed.' 
        });
    }
}

export { authenticateUser }
