const ActivityLog = require('../models/mongo/ActivityLog');

/**
 * Activity logging middleware/utility
 * Automatically logs system activities for admin dashboard
 */

/**
 * Log an activity to the database
 * @param {string} type - Type of activity (student, faculty, company, placement)
 * @param {string} action - Action performed (registered, added, onboarded, created)
 * @param {string} message - Human-readable message
 * @param {string} detail - Additional details
 * @param {string} referenceId - ID of related document
 * @param {object} metadata - Extra data (email, name, etc.)
 */
async function logActivity(type, action, message, detail = '', referenceId = null, metadata = {}) {
    try {
        const activityLog = new ActivityLog({
            type,
            action,
            message,
            detail,
            referenceId,
            metadata,
            createdAt: new Date()
        });

        // Fire and forget - don't block the main request
        await activityLog.save();
        console.log(`[Activity Log] ${type} - ${message}`);
    } catch (error) {
        // Log error but don't throw - activity logging shouldn't break the app
        console.error('Error logging activity:', error);
    }
}

/**
 * Express middleware for automatic activity logging
 * Usage: Add after successful operations in controllers
 */
function createActivityLogger(type, action, getMessageFn) {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send;

        // Override send function to log after successful response
        res.send = function (data) {
            // Only log on successful responses (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const message = getMessageFn(req, res);
                const detail = req.body?.email || req.body?.name || '';
                const referenceId = res.locals?.createdId || req.params?.id || null;
                const metadata = {
                    userId: req.user?.id,
                    userEmail: req.user?.email,
                    ip: req.ip
                };

                // Log asynchronously (fire and forget)
                logActivity(type, action, message, detail, referenceId, metadata).catch(err => {
                    console.error('Failed to log activity:', err);
                });
            }

            // Call original send
            return originalSend.call(this, data);
        };

        next();
    };
}

/**
 * Convenience functions for common activities
 */
async function logStudentRegistration(studentId, email, name) {
    return logActivity(
        'student',
        'registered',
        'Student Registered',
        `${name} (${email}) joined the platform`,
        studentId,
        { email, name }
    );
}

async function logFacultyAdded(facultyId, email, name, department) {
    return logActivity(
        'faculty',
        'added',
        'Faculty Added',
        `${name} added to ${department} Department`,
        facultyId,
        { email, name, department }
    );
}

async function logCompanyOnboarded(companyId, companyName, industry) {
    return logActivity(
        'company',
        'onboarded',
        'Company Onboarded',
        `${companyName} registered for campus placement`,
        companyId,
        { companyName, industry }
    );
}

async function logPlacementCreated(placementId, companyName, role) {
    return logActivity(
        'placement',
        'created',
        'Placement Drive',
        `${companyName} scheduled for ${role} position`,
        placementId,
        { companyName, role }
    );
}

module.exports = {
    logActivity,
    createActivityLogger,
    logStudentRegistration,
    logFacultyAdded,
    logCompanyOnboarded,
    logPlacementCreated
};
