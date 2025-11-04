import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import './App.css'
import MainLayout from "./layouts/MainLayout"
import ProtectAuthRoutes from "./modules/auth/components/ProtectAuthRoutes"
import Home from "./modules/home/design/Home"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Login from "./modules/auth/design/Login"
import NewAccount from "./modules/auth/design/NewAccount"
import { TriggerAlertProvider } from "./modules/alerts/states/TriggerAlert"
import Shop from "./modules/shop/design/Shop"
import { ThemeProvider } from "./modules/products/states/ThemeContext"
import ProductDetail from "./modules/products/design/ProductDetail"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ShoppingCart from "./modules/shopping/design/ShoppingCart"
import ProductDetailSkeleton from "./modules/products/components/ProductDetailSkeleton"
import BuyNow from "./modules/shopping/design/BuyNow"
import CustomerAddresses from "./modules/customers/design/CustomerAddresses"
import AboutIGA from "./modules/home/design/AboutIGA"
import Certifications from "./modules/home/design/Certifications"
import Coverage from "./modules/home/design/Coverage"
import Distributors from "./modules/home/design/Distributors"
import Contact from "./modules/home/design/Contact"
import ShoppingCartResume from "./modules/shopping/design/ShoppingCartResume"
import Checkout from "./modules/shopping/design/Checkout"
import PaymentExiting from "./modules/shopping/design/PaymentExiting"
import PaymentPending from "./modules/shopping/design/PaymentPending"
import PaymentError from "./modules/shopping/design/PaymentError"
import NotFoundPage from "./global/design/NotFoundPage"
import PoliticaPrivacidad from "./modules/policies/PoliticaPrivacidad"

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
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider>
        <TriggerAlertProvider>
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
          { path: "/iniciar-sesion", element: <Login /> },
          { path: "/nueva-cuenta", element: <NewAccount /> },

          // Home
          { path: "/", element: <Home /> },

          // Shop
          { path: "/tienda", element: <Shop /> },
          { path: "/tienda/:categoria/:slug/:sku", element: <ProductDetail /> },

          // Shopping Cart
          { path: "/carrito-de-compras", element: <ShoppingCart /> },

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
          {path: "/politica-de-privacidad", element: <PoliticaPrivacidad/>},

          // Test routes
          { path: "/test", element: <ProductDetailSkeleton /> },
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App