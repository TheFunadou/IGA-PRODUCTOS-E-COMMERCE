import MainNavbar from "./components/Navbar";
import MainFooter from "./components/Footer";
import PageLoader from "../global/components/PageLoader";
import { Suspense, useEffect, useState } from "react";
import { useThemeStore } from "./states/themeStore";
import { useAuthStore } from "../modules/auth/states/authStore";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DrawerMobileMenu from "./components/DrawerMobileMenu";
import CookieConsent from "./components/CookieConsent";
import { useCookieStore } from "../modules/auth/states/cookieStore";

const MainLayout = () => {
    const [showMobileSubmenu, setShowMobileSubmenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isAuth, logout, getProfile, authCustomer } = useAuthStore();
    const { consentStatus, setConsentStatus } = useCookieStore();
    const { setTheme, theme } = useThemeStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout().then(() => navigate("/"));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetConsent = (status: "accepted" | "rejected") => {
        setConsentStatus(status);
    };

    useEffect(() => {
        // H9: revalidar la sesión al boot cuando hay sesión persistida
        if (isAuth) getProfile();
        if (!theme) setTheme("ligth");
    }, []);

    return (
        <div className="w-full relative" id="top">
            <MainNavbar
                onOpenMobileMenu={() => setShowMobileSubmenu(true)}
                onLogout={handleLogout}
                logoutLoading={loading}
            />
            {authCustomer && !authCustomer.verified && (
                <div className="bg-warning text-center p-3">
                    Tu correo electrónico no ha sido verificado, por favor{" "}
                    <Link to="/verificar-correo" className="underline text-primary">
                        realiza tu verificación para poder realizar tus compras aqui.
                    </Link>
                </div>
            )}
            <main className="w-full pb-10 bg-base-100 bg-size-[100%_500px] bg-no-repeat">
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            {consentStatus === null && <CookieConsent onSetConsent={handleSetConsent} />}
            <MainFooter />
            <DrawerMobileMenu onClose={() => setShowMobileSubmenu(false)} isOpen={showMobileSubmenu} onLogout={handleLogout} />
        </div>
    );
};

export default MainLayout;