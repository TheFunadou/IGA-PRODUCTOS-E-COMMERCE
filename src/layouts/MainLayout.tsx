import MainNavbar from "./components/Navbar";
import MainFooter from "./components/Footer";
import { useEffect, useState } from "react";
import { useThemeStore } from "./states/themeStore";
import { useAuthStore } from "../modules/auth/states/authStore";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DrawerMobileMenu from "./components/DrawerMobileMenu";
import CookieConsent from "./components/CookieConsent";
import { useCookieStore } from "../modules/auth/states/cookieStore";
import { usePaymentStore } from "../modules/shopping/states/paymentStore";
import { linkOrderToCustomer } from "../modules/orders/OrdersServices";

const MainLayout = () => {
    const [showMobileSubmenu, setShowMobileSubmenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isAuth, logout, getProfile, authCustomer } = useAuthStore();
    const { order } = usePaymentStore();
    const { cookieConsent, setCookieConsent } = useCookieStore();
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

    const handleSetConsent = (consent: boolean) => {
        setCookieConsent(consent);
    };

    const handleLinkOrder = async ({ orderUUID }: { orderUUID: string }) => {
        try {
            await linkOrderToCustomer({ orderUUID });
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (isAuth && !authCustomer) getProfile();
        if (!theme) setTheme("ligth");
    }, []);

    useEffect(() => {
        if (authCustomer && order && order.orderUUID) handleLinkOrder({ orderUUID: order.orderUUID });
    }, [authCustomer, order])

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
            <main className="w-full px-2 lg:px-10 xl:px-10 pt-5 pb-10 bg-base-300 bg-gradient-to-t from-bg-base-300 to-blue-950 bg-[length:100%_500px] bg-no-repeat">
                <Outlet />
            </main>
            {!cookieConsent && <CookieConsent onSetConsent={handleSetConsent} />}
            <MainFooter />
            <DrawerMobileMenu onClose={() => setShowMobileSubmenu(false)} isOpen={showMobileSubmenu} onLogout={handleLogout} />
        </div>
    );
};

export default MainLayout;