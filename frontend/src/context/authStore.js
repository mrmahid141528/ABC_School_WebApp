import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => {
    // Try to load initial state from cookies upon app load
    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    let user = null;

    if (userStr) {
        try { user = JSON.parse(userStr); } catch (e) { }
    }

    return {
        token: token || null,
        user: user,
        isAuthenticated: !!token,

        login: (tokenData, userData) => {
            Cookies.set('token', tokenData, { expires: 7 }); // 7 days
            Cookies.set('user', JSON.stringify(userData), { expires: 7 });
            set({ token: tokenData, user: userData, isAuthenticated: true });
        },

        logout: () => {
            Cookies.remove('token');
            Cookies.remove('user');
            set({ token: null, user: null, isAuthenticated: false });
        }
    };
});

// Selector hook for ProtectedRoutes
export const useAuth = () => useAuthStore();

export default useAuthStore;
