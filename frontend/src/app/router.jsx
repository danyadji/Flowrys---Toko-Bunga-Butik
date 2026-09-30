import { lazy, useEffect } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import { ProtectedRoute } from "../routes/ProtectedRoute.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Collection = lazy(() => import("../pages/Collection.jsx"));
const ProductDetail = lazy(() => import("../pages/ProductDetail.jsx"));
const Cart = lazy(() => import("../pages/Cart.jsx"));
const Checkout = lazy(() => import("../pages/Checkout.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const AdminLogin = lazy(() => import("../pages/admin/Login.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));

function RootLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "koleksi", element: <Collection /> },
      { path: "produk/:slug", element: <ProductDetail /> },
      { path: "keranjang", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "admin/login", element: <AdminLogin /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
