import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: typeof window !== 'undefined' ? Boolean(localStorage.getItem("access_token")) : false,
    login: (token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("access_token", token); // Asegúrate de establecer el token real aquí
        }
        set({ isLoggedIn: true });
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
        set({ isLoggedIn: false });
    },
}));

export default useAuthStore;
