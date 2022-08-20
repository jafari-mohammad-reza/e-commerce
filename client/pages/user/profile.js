import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/features/authSlice";

const Profile = () => {
    const selector = useSelector(selectCurrentUser)
    const [user, setUser] = useState(undefined)
    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(selector)
        }
    }, [])
    return (
        <div>
            <h2 className="text-7xl">
                Hello {
                user ? user.username : "Guest"
            }
            </h2>
        </div>
    );
};

export default Profile;
