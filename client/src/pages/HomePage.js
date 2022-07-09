import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../app/features/auth/authSlice";
import {Link} from "react-router-dom";

export default function HomePage() {
    const token = useSelector(selectCurrentToken)
    return <div>
        <Link to={"/admin"}>admin route</Link>
        {token}</div>;
}
