/**
 * Pagination utility for API requests
 */

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Build query string for pagination
 */
export function buildPaginationQuery(params: PaginationParams): string {
    const {
        page = 1,
        limit = 20,
        sortBy,
        sortOrder = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: Math.min(limit, 100).toString(), // Max 100 items per page
    });

    if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortOrder', sortOrder);
    }

    return queryParams.toString();
}

/**
 * Parse pagination metadata from response
 */
export function parsePaginationMeta(data: any) {
    return {
        page: data.page || 1,
        limit: data.limit || 20,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
        hasNext: data.hasNext || false,
        hasPrev: data.hasPrev || false
    };
}
