import '../styles/globals.css'
import {Provider} from "react-redux";
import {store} from "../app/store";
import Layout from "../components/Layout";
import {ApolloProvider} from "@apollo/client";
import client from "../apollo-client";

function MyApp({Component, pageProps}) {
    return <Provider store={store}>
        <ApolloProvider client={client}>

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ApolloProvider>

    </Provider>
}

export default MyApp
