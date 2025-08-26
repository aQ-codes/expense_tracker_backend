export default class CookieService {
    /**
     * Set authentication token cookie
     * @param {Object} res - Response object
     * @param {String} token - JWT token
     */
    static setAuthCookie(res, token) {
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction, // Must be true in production for sameSite: 'none'
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
            // Add domain configuration for production
            ...(isProduction && {
                domain: undefined // Don't set domain for cross-origin cookies
            })
        });
    }

    /**
     * Clear authentication token cookie
     * @param {Object} res - Response object
     */
    static clearAuthCookie(res) {
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 0,
            // Match the same settings as when setting the cookie
            ...(isProduction && {
                domain: undefined
            })
        });
    }
}