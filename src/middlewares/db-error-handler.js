/**
 * Database error handler middleware
 * Handles MongoDB-specific errors and converts them to user-friendly responses
 */
export const dbErrorHandler = (err, req, res, next) => {
    console.error('Database Error:', err);

    // Handle duplicate key errors (e.g., duplicate email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            status: false,
            message: `${field} already exists`,
            errors: { [field]: `${field} already exists` }
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        const errors = {};
        Object.keys(err.errors).forEach(key => {
            errors[key] = err.errors[key].message;
        });
        return res.status(400).json({
            status: false,
            message: 'Validation failed',
            errors
        });
    }

    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: false,
            message: 'Invalid ID format',
            errors: { id: 'Invalid ID format' }
        });
    }

    // Handle other database errors
    return res.status(500).json({
        status: false,
        message: 'Database error occurred',
        errors: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
};
