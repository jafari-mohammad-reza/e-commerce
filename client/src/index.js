import React from "react";
import {CookiesProvider} from "react-cookie";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import {GlobalStyle} from "./components/GlobalStyle";
import {Provider} from "react-redux";
import store from "./app/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <GlobalStyle/>
            <CookiesProvider>
                <App/>
            </CookiesProvider>
        </BrowserRouter>
    </Provider>
);
