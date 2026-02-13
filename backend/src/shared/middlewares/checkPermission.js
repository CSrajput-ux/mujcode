// ==================================================
// PERMISSION MIDDLEWARE
// Check if user has required permissions
// ==================================================

const mongoose = require('mongoose');

// Connect to Role model (assuming it exists in MongoDB)
const Role = mongoose.model('Role');

/**
 * Get user permissions from database
 */
async function getUserPermissions(userId) {
    try {
        // Import User models
        const User = require('../../models/pg/User');
        const AdminProfile = require('../../models/pg/AdminProfile');

        // Get user from PostgreSQL
        const user = await User.findByPk(userId, {
            include: [{ model: AdminProfile }]
        });

        if (!user || user.role !== 'admin') {
            return [];
        }

        // Get role from user's admin profile
        const adminProfile = user.AdminProfile;
        if (!adminProfile) {
            return [];
        }

        // Map access level to role name
        const roleMapping = {
            'SUPER_ADMIN': 'SUPER_ADMIN',
            'ADMIN': 'ADMIN',
            'CONTENT_ADMIN': 'CONTENT_ADMIN',
            'PLACEMENT_COORDINATOR': 'PLACEMENT_COORDINATOR'
        };

        const roleName = roleMapping[adminProfile.accessLevel] || 'ADMIN';

        // Get permissions from MongoDB role
        const role = await Role.findOne({ name: roleName });

        if (!role) {
            console.warn(`Role ${roleName} not found in database`);
            return [];
        }

        return role.permissions || [];
    } catch (error) {
        console.error('Error getting user permissions:', error);
        return [];
    }
}

/**
 * Middleware to check permissions
 * Usage: checkPermission(['user.create.bulk', 'user.student.manage'])
 */
const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            // Get user permissions
            const userPermissions = await getUserPermissions(req.user.id);

            // Check if user has at least one of the required permissions
            const hasPermission = requiredPermissions.some(permission =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'Insufficient permissions',
                    required: requiredPermissions,
                    userHas: userPermissions.length > 0 ? 'See audit logs' : 'None'
                });
            }

            // Attach permissions to request for logging
            req.userPermissions = userPermissions;
            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to verify permissions'
            });
        }
    };
};

/**
 * Middleware to check if user has ALL required permissions
 */
const checkAllPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            const userPermissions = await getUserPermissions(req.user.id);

            const hasAllPermissions = requiredPermissions.every(permission =>
                userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                const missing = requiredPermissions.filter(p => !userPermissions.includes(p));
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'Insufficient permissions',
                    missing: missing
                });
            }

            req.userPermissions = userPermissions;
            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to verify permissions'
            });
        }
    };
};

/**
 * Middleware to get user permissions (doesn't block)
 */
const attachPermissions = async (req, res, next) => {
    try {
        if (req.user) {
            req.userPermissions = await getUserPermissions(req.user.id);
        } else {
            req.userPermissions = [];
        }
        next();
    } catch (error) {
        console.error('Error attaching permissions:', error);
        req.userPermissions = [];
        next();
    }
};

module.exports = {
    checkPermission,
    checkAllPermissions,
    attachPermissions,
    getUserPermissions
};
