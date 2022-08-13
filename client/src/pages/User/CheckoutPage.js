import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentToken, selectCurrentUser,} from "../../app/features/auth/authSlice";

export default function CheckoutPage() {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    return (
        <div>
            {user?.email}
            {user?.username}
            {token?.split(" ")[1]}
        </div>
    );
}
