import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import { lazy, Suspense, useEffect, useState } from "react"
import type { ComponentType } from "react"
import './App.css'
import MainLayout from "./layouts/MainLayout"
import ProtectAuthRoutes from "./modules/auth/components/ProtectAuthRoutes"
import NotFoundPage from "./global/design/NotFoundPage"
import PageLoader from "./global/components/PageLoader"


// Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { TriggerAlertProvider } from "./modules/alerts/states/TriggerAlert"
import { ThemeProvider } from "./modules/products/states/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useThemeStore } from "./layouts/states/themeStore"
import ScrollToTop from "./global/components/ScrollToTop"

import { usePageTracking } from "./modules/analytics/usePageTracking";

// Wrapper lazy: los providers de Google solo se cargan en /iniciar-sesion
const AuthProviders = lazy(() => import("./modules/auth/components/AuthProviders"));

// ── Lazy routes (code-splitting) ──────────────────────────────────────────────
const Home = lazy(() => import("./modules/home/design/Home"))
const Login = lazy(() => import("./modules/auth/design/Login"))
const CreateAccount = lazy(() => import("./modules/auth/design/CreateAccount"))
const RestorePassword = lazy(() => import("./modules/auth/design/RestorePassword"))
const CustomerAddresses = lazy(() => import("./modules/customers/design/CustomerAddresses"))
const ShopV2 = lazy(() => import("./modules/shop/design/Shop"))
const ProductVersionDetailV2 = lazy(() => import("./modules/products/design/ProductVersionDetailV2"))
const ShoppingCartV2 = lazy(() => import("./modules/shopping/design/ShoppingCart"))
const ShoppingCartResumeV2 = lazy(() => import("./modules/shopping/design/ShoppingCartResume"))
const CheckoutV2 = lazy(() => import("./modules/shopping/design/Checkout"))
const BuyNow = lazy(() => import("./modules/shopping/design/BuyNow"))
const PaymentExitingV2 = lazy(() => import("./modules/payments/design/PaymentExiting"))
const PaymentPendingV2 = lazy(() => import("./modules/payments/design/PaymentPending"))
const PaymentErrorV2 = lazy(() => import("./modules/payments/design/PaymentError"))
const Orders = lazy(() => import("./modules/orders/design/Orders"))
const OrderDetail = lazy(() => import("./modules/orders/design/OrderDetail"))
const Ticket = lazy(() => import("./modules/orders/design/Ticket"))
const CustomerFavorites = lazy(() => import("./modules/customers/design/CustomerFavorites"))
const CustomerPersonalInfo = lazy(() => import("./modules/customers/design/CustomerPersonalInfo"))
const AboutIGA = lazy(() => import("./modules/home/design/AboutIGA"))
const Certifications = lazy(() => import("./modules/home/design/Certifications"))
const Coverage = lazy(() => import("./modules/home/design/Coverage"))
const Distributors = lazy(() => import("./modules/home/design/Distributors"))
const Contact = lazy(() => import("./modules/home/design/Contact"))
const FrecuentQuestions = lazy(() => import("./modules/home/design/FrecuentQuestions"))
const PrivacyPolicy = lazy(() => import("./modules/policies/PrivacyPolicy"))
const PNCPolicy = lazy(() => import("./modules/policies/PNCPolicy"))
const TermsAndConditions = lazy(() => import("./modules/policies/TermsAndConditions"))
const AnceCert = lazy(() => import("./modules/home/design/AnceCert"))
const QRRedirectCorazaPlago = lazy(() =>
    import("./modules/products/components/QRRedirect").then((m) => ({ default: m.QRRedirectCorazaPlago })))
const QRRedirectPlagoCorazaAI = lazy(() =>
    import("./modules/products/components/QRRedirect").then((m) => ({ default: m.QRRedirectPlagoCorazaAI })))

// Crear QueryClient fuera del componente para evitar recreación
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 3
        },
    },
});

// DevTools de React Query solo en desarrollo (fuera del bundle de producción)
function QueryDevTools() {
    const [Devtools, setDevtools] = useState<ComponentType<{ initialIsOpen?: boolean }> | null>(null);

    useEffect(() => {
        if (import.meta.env.DEV) {
            import("@tanstack/react-query-devtools").then((m) => setDevtools(() => m.ReactQueryDevtools));
        }
    }, []);

    if (!Devtools) return null;
    return <Devtools initialIsOpen={false} />;
}

// Wrapper para los providers
function RootLayout() {
    usePageTracking();
    return (
        <QueryClientProvider client={queryClient}>
            <QueryDevTools />
            <ThemeProvider>
                <TriggerAlertProvider>
                    <ScrollToTop />
                    <Outlet />
                </TriggerAlertProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

// Configuración del router
const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    // Rutas protegidas por autenticación
                    {
                        element: <ProtectAuthRoutes />,
                        children: [
                            {
                                path: "/mi-cuenta/direcciones-de-envio",
                                element: <CustomerAddresses />
                            }
                        ]
                    },

                    // Auth
                    { path: "/iniciar-sesion", element: <AuthProviders><Login /></AuthProviders> },
                    { path: "/nueva-cuenta", element: <CreateAccount /> },
                    { path: "/restablecer-contraseña", element: <RestorePassword /> },

                    // Home
                    { path: "/", element: <Home /> },

                    // Shop
                    { path: "/tienda", element: <ShopV2 /> },
                    { path: "/tienda/:categoria/:slug/:sku", element: <ProductVersionDetailV2 /> },

                    // Shopping Cart
                    { path: "/carrito-de-compras", element: <ShoppingCartV2 /> },

                    // Orders
                    { path: "/mis-ordenes", element: <Orders /> },
                    { path: "/mis-ordenes/detalle/:order-uuid", element: <OrderDetail /> },
                    { path: "/mis-favoritos", element: <CustomerFavorites /> },
                    { path: "/mi-cuenta/informacion-personal", element: <CustomerPersonalInfo /> },

                    // Checkout
                    { path: "/resumen-de-carrito", element: <ShoppingCartResumeV2 /> },
                    { path: "/pagar-productos", element: <CheckoutV2 /> },
                    { path: "/pagar-ahora/:product-uuid/:sku", element: <BuyNow /> },
                    { path: "/pagar-productos/pago-exitoso", element: <PaymentExitingV2 /> },
                    { path: "/pagar-productos/pago-pendiente", element: <PaymentPendingV2 /> },
                    { path: "/pagar-productos/pago-fallido", element: <PaymentErrorV2 /> },

                    // Rutas públicas
                    { path: "/acerca-de-iga", element: <AboutIGA /> },
                    { path: "/certificaciones", element: <Certifications /> },
                    { path: "/cobertura", element: <Coverage /> },
                    { path: "/contacto", element: <Contact /> },
                    { path: "/distribuidores", element: <Distributors /> },
                    { path: "/preguntas-frecuentes", element: <FrecuentQuestions /> },

                    // Policies
                    { path: "/politica-de-privacidad", element: <PrivacyPolicy /> },
                    { path: "/politica-de-devolucion", element: <PNCPolicy /> },
                    { path: "/terminos-y-condiciones", element: <TermsAndConditions /> },
                    { path: "/wp-content/uploads/2025/09/CERT_CORAZA_Y_PLAGOSUR_A_M_CLASE_E-.pdf", element: <QRRedirectCorazaPlago /> },
                    { path: "/wp-content/uploads/2025/09/CERT_PLAGOSUR_C_CORAZA_A_I_CLASE_E_.pdf", element: <QRRedirectPlagoCorazaAI /> },

                    //Certs
                    { path: "/certificados/ance", element: <AnceCert /> }

                ]
            },
            {
                path: "/pagar-productos/ticket/:order_id",
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Ticket />
                    </Suspense>
                )
            }
        ]
    }
]);

function App() {
    const { theme } = useThemeStore();
    useEffect(() => { document.documentElement.setAttribute("data-theme", theme!) }, [theme]);
    return <RouterProvider router={router} />
}

export default App
