import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

const useAuthStore = create((set) => ({
    isLoggedIn:
        typeof window !== "undefined"
            ? Boolean(localStorage.getItem("access_token"))
            : false,
    login: (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", token); // Asegúrate de establecer el token real aquí
            const decoded = jwtDecode(token);
            set({ isLoggedIn: true, userData: decoded });
        }
    },
    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            set({ isLoggedIn: false, userData: null });
        }
    },
    userData: null,
    setUserData: (userData) => set({ userData }),
}));

export default useAuthStore;
