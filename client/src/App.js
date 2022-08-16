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
import MobileLoginPage from "./pages/Auth/MobileLoginPage";
import RequireAuth from "./app/features/auth/RequireAuth";
import {Roles} from "./conf/constants";
import OnlineSupport from "./pages/Support/OnlineSupport";
import SupporterPage from "./pages/Support/SupporterPage";
import {ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache} from "@apollo/client"
import {onError} from "@apollo/client/link/error"
import Swal from "sweetalert2";
import Profile from "./pages/User/Profile";
import Blogs from "./pages/Blogs/Blogs";
import DiscountsPage from "./pages/Products/DiscountsPage";
import Blog from "./pages/Blogs/BlogById";
import Product from "./pages/Products/Product";
import Category from "./pages/Products/Category";

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        graphQLErrors.map(({message, locations, path, statusCode}) => {
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path} , StatusCode: ${statusCode}`);
            Swal.fire({
                title: "Error",
                text: message,
                icon: "error"
            })
        })
    }
    if (graphQLErrors.status === 429) {
        Swal.fire({
            title: "Error",
            text: "Too many requests",
            icon: "error"
        })
    }

})
const link = from([
    errorLink,
    new HttpLink({
        uri: "http://localhost:5000/graphql",
    })
])


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
})

function App() {
    const {pathname} = useLocation();
    const [currentPage, setCurrentPage] = useState(pathname);
    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);
    const HomePage = lazy(() => import("./pages/HomePage"));
    const CheckoutPage = lazy(() => import("./pages/User/CheckoutPage"));
    const NotFound = lazy(() => import("./pages/NotFound"));
    const AdminDashboard = lazy(() => import("./pages/Admin/AdminRoutes"));
    axios.defaults.withCredentials = true;

    return (
        <ApolloProvider client={client}>
            <Helmet>
                <title>
                    E-Commerce |{" "}
                    {currentPage === "/" ? "home" : currentPage.replace("/", "")}
                </title>
            </Helmet>

            {!pathname.includes("/admin") && !pathname.includes("/online-support") && !pathname.includes("/profile") &&
                <Header/>}
            <Suspense fallback={<LoadingComponent/>}>
                <Routes>
                    <Route path="/" index element={<HomePage/>}/>
                    <Route path="/blogs" element={<Blogs/>}/>
                    <Route path="/blogs/:id" element={<Blog/>}/>
                    <Route path="/products/:title" element={<Product/>}/>
                    <Route path="/today-discounts" index element={<DiscountsPage/>}/>
                    <Route path="/categories/:title" element={<Category/>}/>

                    //! Auth Routes
                    <Route path="/register" index element={<RegisterPage/>}/>
                    <Route path="/login" index element={<LoginPage/>}/>
                    <Route path="/login-mobile" index element={<MobileLoginPage/>}/>
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

                    <Route element={<RequireAuth allowedRoutes={Roles.ADMIN}/>}>
                        <Route path={"/admin/*"} element={<AdminDashboard/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedRoutes={Roles.USER}/>}>
                        <Route path={"/profile/*"} element={<Profile/>}/>
                        <Route path="/cart" index element={<CheckoutPage/>}/>
                        <Route path="/online-support" index element={<OnlineSupport/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedRoutes={Roles.SUPPORTER}/>}>
                        <Route path="/supporter-page" index element={<SupporterPage/>}/>
                    </Route>
                    <Route path="*" element={<NotFound/>}/>

                </Routes>
            </Suspense>
        </ApolloProvider>
    );
}

export default App;
