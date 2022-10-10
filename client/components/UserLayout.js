import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logout, selectCurrentUser} from "../app/features/authSlice";
import Link from "next/link";
import {useRouter} from "next/router";

const UserLayout = ({children}) => {
    const selector = useSelector(selectCurrentUser)
    const [user, setUser] = useState(undefined)
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(selector)
        }
    }, [])
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState("Profile")
    const UserLink = ({title, path = undefined}) => {
        return <Link href={`/user/${path ? path.toLowerCase() : title.toLowerCase()}`}>
            <a className={`font-semibold text-xl lg:text-2xl ${currentPage === title && "text-blue-500"} hover:text-blue-300`}
               onClick={() => setCurrentPage(title)}>
                {title}
            </a>
        </Link>
    }
    return (
        <div className={'grid grid-cols-1 md:grid-cols-12 h-screen w-full pt-10 px-10 '}>
            <div className={'h-screen hidden  md:col-span-1 md:flex flex-col items-start justify-start space-y-7'}>
                <UserLink title={"Dashboard"} path={"/"}/>
                <UserLink title={"Information"}/>
                <UserLink title={"Orders"}/>
                <UserLink title={"Discounts"}/>
                <UserLink title={"BookMarks"}/>
                <hr/>
                <button className={'auth_button'} onClick={async () => {
                    dispatch(logout())
                    await router.push("http://localhost:3000/auth/login")
                }}>
                    Logout
                </button>
            </div>
            <div className={'h-screen overflow-y-scroll col-span-full md:col-span-11'}>
                {children}
            </div>
        </div>
    );
};

export default UserLayout;
