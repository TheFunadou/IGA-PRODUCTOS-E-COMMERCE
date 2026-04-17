import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import './App.css'
import MainLayout from "./layouts/MainLayout"
import ProtectAuthRoutes from "./modules/auth/components/ProtectAuthRoutes"
import Home from "./modules/home/design/Home"


// Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Login from "./modules/auth/design/Login"
import { TriggerAlertProvider } from "./modules/alerts/states/TriggerAlert"
import Shop from "./modules/shop/design/Shop"
import { ThemeProvider } from "./modules/products/states/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import BuyNow from "./modules/shopping/design/BuyNow"
import CustomerAddresses from "./modules/customers/design/CustomerAddresses"
import AboutIGA from "./modules/home/design/AboutIGA"
import Certifications from "./modules/home/design/Certifications"
import Coverage from "./modules/home/design/Coverage"
import Distributors from "./modules/home/design/Distributors"
import Contact from "./modules/home/design/Contact"
import FrecuentQuestions from "./modules/home/design/FrecuentQuestions"
import NotFoundPage from "./global/design/NotFoundPage"
import PrivacyPolicy from "./modules/policies/PrivacyPolicy"
import CustomerFavorites from "./modules/customers/design/CustomerFavorites"
import CreateAccount from "./modules/auth/design/CreateAccount"
import CustomerPersonalInfo from "./modules/customers/design/CustomerPersonalInfo"
import Ticket from "./modules/orders/design/Ticket"
import { useThemeStore } from "./layouts/states/themeStore"
import { useEffect } from "react"
import PNCPolicy from "./modules/policies/PNCPolicy"
import Orders from "./modules/orders/design/Orders"
import OrderDetail from "./modules/orders/design/OrderDetail"
import TermsAndConditions from "./modules/policies/TermsAndConditions"

import { GoogleOAuthProvider } from "@react-oauth/google";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import RestorePassword from "./modules/auth/design/RestorePassword"
import ScrollToTop from "./global/components/ScrollToTop"
import ProductVersionDetailV2 from "./modules/products/design/ProductVersionDetailV2"
import ShoppingCartV2 from "./modules/shopping/design/ShoppingCartV2"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import ShoppingCartResumeV2 from "./modules/shopping/design/ShoppingCartResumeV2"
import CheckoutV2 from "./modules/shopping/design/CheckoutV2"
import PaymentExitingV2 from "./modules/payments/design/PaymentExitingV2"
import PaymentPendingV2 from "./modules/payments/design/PaymentPendingV2"
import PaymentErrorV2 from "./modules/payments/design/PaymentErrorV2"
import { QRRedirectCorazaPlago, QRRedirectPlagoCorazaAI } from "./modules/products/components/QRRedirect"

// Crear QueryClient fuera del componente para evitar recreación
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3
    },
  },
});


// Wrapper para los providers
function RootLayout() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider>
            <TriggerAlertProvider>
              <ScrollToTop />
              <Outlet />
            </TriggerAlertProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </GoogleReCaptchaProvider>
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
          { path: "/iniciar-sesion", element: <Login /> },
          { path: "/nueva-cuenta", element: <CreateAccount /> },
          { path: "/restablecer-contraseña", element: <RestorePassword /> },

          // Home
          { path: "/", element: <Home /> },

          // Shop
          { path: "/tienda", element: <Shop /> },
          { path: "/tienda/:categoria/:slug/:sku", element: <ProductVersionDetailV2 /> },

          // Shopping Cart
          { path: "/carrito-de-compras", element: <ShoppingCartV2 /> },

          // Orders
          { path: "/mis-ordenes", element: <Orders /> },
          { path: "/mis-ordenes/detalle", element: <OrderDetail /> },
          { path: "/mis-favoritos", element: <CustomerFavorites /> },
          { path: "/mi-cuenta/informacion-personal", element: <CustomerPersonalInfo /> },

          // Checkout
          { path: "/resumen-de-carrito", element: <ShoppingCartResumeV2 /> },
          { path: "/pagar-productos", element: <CheckoutV2 /> },
          { path: "/pagar-ahora", element: <BuyNow /> },
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

        ]
      },
      { path: "/pagar-productos/ticket/:order_id", element: <Ticket /> }
    ]
  }
]);

function App() {
  const { theme } = useThemeStore();
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme!) }, [theme]);
  return <RouterProvider router={router} />
}

export default App