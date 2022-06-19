import React from "react";
import {CookiesProvider} from "react-cookie";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import {GlobalStyle} from "./components/GlobalStyle";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <GlobalStyle/>
        <CookiesProvider>
            <App/>
        </CookiesProvider>
    </BrowserRouter>
);
