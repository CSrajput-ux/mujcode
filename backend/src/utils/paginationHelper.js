/**
 * Pagination helper middleware for Express routes
 */

/**
 * Extract and validate pagination parameters from query
 */
function getPaginationParams(req) {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

/**
 * Build pagination metadata for response
 */
function buildPaginationMeta(page, limit, total) {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
}

/**
 * Send paginated response
 */
function sendPaginatedResponse(res, items, page, limit, total) {
    const pagination = buildPaginationMeta(page, limit, total);

    return res.json({
        items,
        pagination
    });
}

module.exports = {
    getPaginationParams,
    buildPaginationMeta,
    sendPaginatedResponse
};
