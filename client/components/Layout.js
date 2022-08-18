import React, {Fragment, useEffect} from 'react';
import {useRouter} from "next/router";
import Head from "next/head";

const Layout = ({children}) => {
    const {pathname} = useRouter()
    const [currentPage, setCurrentPage] = React.useState(pathname.replace("/", ""))
    useEffect(() => {
        setCurrentPage(pathname.replace("/", ""))
    }, [pathname]);

    return (
        <Fragment>
            <Head>
                <title>e-shop | {currentPage === "" ? "Home" : currentPage}</title>
            </Head>
            <main>
                {children}
            </main>
        </Fragment>
    );
};

export default Layout;
