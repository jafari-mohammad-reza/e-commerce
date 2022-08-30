import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logout, selectCurrentUser} from "../app/features/authSlice";
import {useRouter} from "next/router";
import Link from "next/link";

const AdminLayout = ({children}) => {
    const selector = useSelector(selectCurrentUser)
    const [user, setUser] = useState(undefined)
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(selector)
            user && user.Role.index("admin") <= 0 && router.push("/")
        }
    }, [])
    const dispatch = useDispatch()
    const [currentPage , setCurrentPage] = useState("Dashboard")
    const UserLink = ({ title}) => {
        return <Link href={`/admin/${title.toLowerCase()}`}>
            <a className={`font-semibold text-xl lg:text-2xl ${currentPage === title && "text-blue-500"} hover:text-blue-300`} onClick={() =>setCurrentPage(title)}>
                {title}
            </a>
        </Link>
    }
    return (
        <div className={'grid grid-cols-1 md:grid-cols-12 h-screen overflow-hidden w-full pt-10 px-10 '}>
            <div className={'h-screen col-span-1 flex flex-col items-start justify-start space-y-7'}>
                <UserLink title={"Dashboard"}/>
                <UserLink title={"Users"}/>
                <UserLink title={"Products"}/>
                <UserLink title={"Categories"}/>
                <UserLink title={"Blogs"}/>
                <UserLink title={"Roles"}/>
                <UserLink title={"Permissions"}/>
                <UserLink title={"Discounts"}/>
                <UserLink title={"Orders"}/>
                <hr/>
                <button className={'auth_button'} onClick={() => {
                    dispatch(logout())
                    router.push("http://localhost:3000/auth/login")
                }}>
                    Logout
                </button>
            </div>
            <div className={'h-full overflow-y-scroll col-span-11'}>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;