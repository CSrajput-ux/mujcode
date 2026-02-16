/**
 * Utility to safely get user data from localStorage
 */
export const getUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
    }
};

/**
 * Utility to safely get token from localStorage
 */
export const getToken = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
    }
};

/**
 * Utility to safely set user data in localStorage
 */
export const setUser = (user: any) => {
    try {
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    } catch (error) {
        console.error('Error setting user data in localStorage:', error);
        return false;
    }
};

/**
 * Clear all auth data from storage
 */
export const clearAuthData = () => {
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Also clear sessionStorage in case there's old data
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        return true;
    } catch (error) {
        console.error('Error clearing auth data:', error);
        return false;
    }
};
