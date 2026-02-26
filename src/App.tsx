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
import ProductDetail from "./modules/products/design/ProductDetail"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ShoppingCart from "./modules/shopping/design/ShoppingCart"
import BuyNow from "./modules/shopping/design/BuyNow"
import CustomerAddresses from "./modules/customers/design/CustomerAddresses"
import AboutIGA from "./modules/home/design/AboutIGA"
import Certifications from "./modules/home/design/Certifications"
import Coverage from "./modules/home/design/Coverage"
import Distributors from "./modules/home/design/Distributors"
import Contact from "./modules/home/design/Contact"
import ShoppingCartResume from "./modules/shopping/design/ShoppingCartResume"
import Checkout from "./modules/shopping/design/Checkout"
import NotFoundPage from "./global/design/NotFoundPage"
import PoliticaPrivacidad from "./modules/policies/PoliticaPrivacidad"
import CustomerFavorites from "./modules/customers/design/CustomerFavorites"
import CreateAccount from "./modules/auth/design/CreateAccount"
import CustomerPersonalInfo from "./modules/customers/design/CustomerPersonalInfo"
import Ticket from "./modules/orders/design/Ticket"
import { useThemeStore } from "./layouts/states/themeStore"
import { useEffect } from "react"
import PaymentExiting from "./modules/payments/design/PaymentExiting"
import PaymentPending from "./modules/payments/design/PaymentPending"
import PNCPolicy from "./modules/policies/PNCPolicy"
import Orders from "./modules/orders/design/Orders"
import OrderDetail from "./modules/orders/design/OrderDetail"
import PaymentError from "./modules/payments/design/PaymentError"

import { GoogleOAuthProvider } from "@react-oauth/google";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import RestorePassword from "./modules/auth/design/RestorePassword"

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
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "TU_CLAVE_DE_SITIO_RECAPTCHA"}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "TU_CLIENT_ID_DE_GOOGLE"}>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <ThemeProvider>
            <TriggerAlertProvider>
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
          { path: "/tienda/:categoria/:slug/:sku", element: <ProductDetail /> },

          // Shopping Cart
          { path: "/carrito-de-compras", element: <ShoppingCart /> },

          // Orders
          { path: "/mis-ordenes", element: <Orders /> },
          { path: "/mis-ordenes/detalle", element: <OrderDetail /> },
          { path: "/mis-favoritos", element: <CustomerFavorites /> },
          { path: "/mi-cuenta/informacion-personal", element: <CustomerPersonalInfo /> },

          // Checkout
          { path: "/resumen-de-carrito", element: <ShoppingCartResume /> },
          { path: "/pagar-productos", element: <Checkout /> },
          { path: "/pagar-ahora", element: <BuyNow /> },
          { path: "/pagar-productos/pago-exitoso", element: <PaymentExiting /> },
          { path: "/pagar-productos/pago-pendiente", element: <PaymentPending /> },
          { path: "/pagar-productos/pago-fallido", element: <PaymentError /> },

          // Rutas públicas
          { path: "/acerca-de-iga", element: <AboutIGA /> },
          { path: "/certificaciones", element: <Certifications /> },
          { path: "/cobertura", element: <Coverage /> },
          { path: "/contacto", element: <Contact /> },
          { path: "/distribuidores", element: <Distributors /> },

          // Policies
          { path: "/politica-de-privacidad", element: <PoliticaPrivacidad /> },
          { path: "/politica-de-devolucion", element: <PNCPolicy /> },

        ]
      },
      { path: "/pagar-productos/ticket/:order_id", element: <Ticket /> }
    ]
  }
]);

function App() {
  const { theme } = useThemeStore();
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme) }, [theme]);
  return <RouterProvider router={router} />
}

export default App