import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/features/authSlice";
import Link from "next/link";
import UserLayout from "../../components/UserLayout";

const Profile = () => {

    return (
        <UserLayout>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias architecto eius eveniet voluptate. Blanditiis dolore doloremque error iure nobis odio, odit officia praesentium saepe similique tempora, temporibus ut velit, voluptates!
            </p>
        </UserLayout>
    );
};

export default Profile;
