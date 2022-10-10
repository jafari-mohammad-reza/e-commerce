import {onError} from "@apollo/client/link/error";
import {ApolloClient, from, HttpLink, InMemoryCache} from "@apollo/client";
import Swal from "sweetalert2";
import {SERVER_ADDRESS} from "./conf/constantValues";

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({message, locations, path}) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) {
        Swal.fire({
            icon: "error",
            title: "Ooops",
            text: networkError.message,
            showConfirmButton: true
        })
        console.log(`[Network error]: ${networkError}`)
    }

});

const httpLink = new HttpLink({uri: `${SERVER_ADDRESS}/graphql`, credentials: "include"})
const client = new ApolloClient({
    cache: new InMemoryCache({resultCaching:true,canonizeResults:true}),
    link: from([httpLink, errorLink]),
});

export default client;
