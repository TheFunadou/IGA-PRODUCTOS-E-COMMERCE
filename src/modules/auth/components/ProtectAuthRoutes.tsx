import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../states/authStore";

export const ProtectAuthRoutes = () => {
    const { isAuth } = useAuthStore();

    // If the user is not logged in, redirect to the login page
    return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectAuthRoutes;