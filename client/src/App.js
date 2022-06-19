import React, {lazy, Suspense, useEffect, useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import LoadingComponent from "./components/LoadingComponent";
import {Helmet} from "react-helmet";
import Header from "./components/Header";
import axios from "axios";
import LoginPage from "./pages/Auth/LoginPage";
import VerifyAccountPage from "./pages/Auth/VerifyAccountPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

function App() {
    const {pathname} = useLocation();
    const [currentPage, setCurrentPage] = useState(pathname);
    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);
    const HomePage = lazy(() => import("./pages/HomePage"));
    const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
    const NotFound = lazy(() => import("./pages/NotFound"));
    const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
    axios.defaults.withCredentials = true;

    return (
        <>
            <Helmet>
                <title>
                    E-Commerce |{" "}
                    {currentPage === "/" ? "home" : currentPage.replace("/", "")}
                </title>
                {/* <meta http-equiv="X-UA-Compatible" content="IE=7" />
        <meta
          name="description"
          content="E-Commerce website developed by mohammadrezajafari.dev@gmail.com"
        />
        <meta name="keywords" content="E-Commerce , shopping,amazon,digikala" />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="a" /> */}
            </Helmet>

            {!pathname.includes("/admin") && <Header/>}
            <Suspense fallback={<LoadingComponent/>}>
                <Routes>
                    <Route path="/" index element={<HomePage/>}/>
                    <Route path="/register" index element={<RegisterPage/>}/>
                    <Route path="/login" index element={<LoginPage/>}/>
                    <Route path="/verify-account" index element={<VerifyAccountPage/>}/>
                    <Route
                        path="/forgot-password"
                        index
                        element={<ForgotPasswordPage/>}
                    />
                    <Route
                        path="/reset-password/:token"
                        index
                        element={<ResetPasswordPage/>}
                    />
                    <Route path="/cart" index element={<CheckoutPage/>}/>
                    <Route path={"/admin/*"} element={<AdminDashboard/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
