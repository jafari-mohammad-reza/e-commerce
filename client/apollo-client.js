import {onError} from "@apollo/client/link/error";
import {ApolloClient, createHttpLink, from, HttpLink, InMemoryCache} from "@apollo/client";
import Swal from "sweetalert2";
import {setContext} from "@apollo/client/link/context";


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





const httpLink = new HttpLink({uri: `http://localhost:5000/graphql`  , credentials:"include"})
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link : from([httpLink ,errorLink])
});

export default client;
