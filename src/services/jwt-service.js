import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/env.js";

// Get JWT_SECRET from environment variables


export default class JwtService {
  
  /**
   * Create JWT token
   * @param {Object} payload - Token payload
   * @returns {String} JWT token
   */
  static createToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '7d' // Token expires in 7 days
    });
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  /**
   * Decode JWT token without verification (for getting payload)
   * @param {String} token - JWT token to decode
   * @returns {Object} Decoded token payload
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }
}
