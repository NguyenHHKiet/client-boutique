import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { checkAuthLoader, tokenLoader } from "./utils/auth";
import RelatedProductProvider from "./context/RelatedProductProvider";
import { actionRegister, actionLogin, actionOrder } from "./API/action";
import axios from "axios";

import Spinner from "react-bootstrap/Spinner";

import Root from "./components/Layout/Root";
import Error from "./pages/Error";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrderPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";

// Lazy routes are resolved on initial load and during the loading or submitting
// Each lazy function will typically return the result of a dynamic import.
const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));

const Loader = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" />
        </div>
    );
};

axios.defaults.baseURL = "https://server-boutique-tau.vercel.app/api";
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        id: "root",
        loader: tokenLoader,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loader />}>
                        <HomePage />
                    </Suspense>
                ),
                loader: () =>
                    import("./API/data").then((module) => module.loader()),
            },
            {
                path: "shop",
                element: (
                    <Suspense fallback={<Loader />}>
                        <ShopPage />
                    </Suspense>
                ),
                loader: () =>
                    import("./API/data").then((module) => module.loader()),
            },
            {
                path: "detail/:productId",
                element: (
                    <Suspense fallback={<Loader />}>
                        <DetailPage />
                    </Suspense>
                ),
                loader: (meta) =>
                    import("./API/data").then((module) =>
                        module.loadDetail(meta)
                    ),
            },
            {
                path: "cart",
                element: (
                    <Suspense fallback={<Loader />}>
                        <CartPage />
                    </Suspense>
                ),
                loader: () =>
                    import("./API/data").then((module) => module.cartLoader()),
            },
            {
                path: "checkout",
                element: <CheckoutPage />,
                loader: checkAuthLoader,
                action: actionOrder,
            },
            {
                path: "login",
                element: <LoginPage />,
                loader: () =>
                    import("./API/data").then((module) => module.tokenCSRF()),
                action: actionLogin,
            },
            {
                path: "register",
                element: <RegisterPage />,
                loader: () =>
                    import("./API/data").then((module) => module.tokenCSRF()),
                action: actionRegister,
            },
            {
                path: "/auth/orders",
                element: <OrderPage />,
                loader: checkAuthLoader,
            },
            {
                path: "/auth/orders/:orderId",
                element: <OrderDetailPage />,
                loader: checkAuthLoader,
            },
        ],
    },
]);

function App() {
    return (
        <RelatedProductProvider>
            <RouterProvider router={router} />
        </RelatedProductProvider>
    );
}

export default App;
