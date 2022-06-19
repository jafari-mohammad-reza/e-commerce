import React, {useEffect} from "react";
import {useCookies} from "react-cookie";

export default function HomePage() {
    const [cookies, setCookie] = useCookies();
    useEffect(() => {
        console.log(cookies["access-token"]);
    }, [cookies]);
    return <div>HomePage</div>;
}
