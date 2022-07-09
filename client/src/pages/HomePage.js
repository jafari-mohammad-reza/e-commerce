import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../app/features/auth/authSlice";
import {Link} from "react-router-dom";

export default function HomePage() {
    const token = useSelector(selectCurrentToken)
    useEffect(() => {
        console.log(document.cookie.toString())
    }, [document.cookie])
    return <div>
        <Link to={"/admin"}>admin route</Link>
        {token}</div>;
}
