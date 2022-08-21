import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../app/features/authSlice";
import {IoCartOutline} from "react-icons/io5";
import {FaUser} from "react-icons/fa";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";

const MyComponent = () => {
    const selector = useSelector(selectCurrentUser)
    const [user, setUser] = useState(undefined)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(selector)
        }
    }, [selector])


    const HeaderOptions = ({isSmallScreen}) => {
        return <>
            <div
                className={`flex ${isSmallScreen && "flex-col space-y-24"} items-center sm:space-x-6 lg:space-x-14 justify-center w-max`}
                onClick={() => setIsMenuOpen(false)}
            >
                {/* Links   */}

                <Link href={'/categories'}>
                    <div className={'nav_link_container group'}>
                        <span className={`${isSmallScreen ? "hidden" : "nav_span"}`}/>
                        <h4 className={` ${isSmallScreen ? "nav_link_smallScreen" : "nav_link"}`}>Categories</h4>
                    </div>
                </Link>
                <Link href={'/discounts'}>
                    <div className={'nav_link_container group'}>
                        <span className={`${isSmallScreen ? "hidden" : "nav_span"}`}/>
                        <h4 className={` ${isSmallScreen ? "nav_link_smallScreen" : "nav_link"}`}>Discounts</h4>
                    </div>

                </Link>
                <Link href={'/blogs'}>
                    <div className={'nav_link_container group'}>
                        <span className={`${isSmallScreen ? "hidden" : "nav_span"}`}/>
                        <h4 className={` ${isSmallScreen ? "nav_link_smallScreen" : "nav_link"}`}>Blogs</h4>
                    </div>

                </Link>
                <Link href={'/contact'}>
                    <div className={'nav_link_container group'}>
                        <span className={`${isSmallScreen ? "hidden" : "nav_span"}`}/>
                        <h4 className={` ${isSmallScreen ? "nav_link_smallScreen" : "nav_link"}`}>Contact
                            us</h4>
                    </div>
                </Link>
            </div>
            <div className={`flex ${isSmallScreen && "flex-col"} items-center justify-center w-max space-x-5`}
                 onClick={() => setIsMenuOpen(false)}>
                {/*    nav options*/}
                {
                    user ? (
                        <div
                            className={`flex ${isSmallScreen ? "flex-col mt-12 space-y-10" : "space-x-5"} items-center justify-center w-max  lg:space-x-10`}>
                            <Link href={user?.role === "USER" ? "/user/profile" : "/admin"}>
                                <FaUser
                                    className={`text-6xl ${isMenuOpen ? "w-20 h-20 text-sky-50 border-wky-50" : "w-16 h-16  border-black"}  border-black rounded-lg p-2 cursor-pointer transition-all transform hover:scale-110`}/>
                            </Link>
                            <Link href={'/cart'}>
                                <IoCartOutline
                                    className={`text-2xl sm:text-4xl lg:text-7xl cursor-pointer ${isSmallScreen ? "text-sky-50 text-8xl " : "text-blue-500"} transform transition-all hover:scale-110 `}/>
                            </Link>

                        </div>
                    ) : (
                        <Link href={'/auth/login'}>
                            <div className={'nav_link_container group'}>
                                <span className={`${isSmallScreen ? "hidden" : "nav_span"}`}/>
                                <h4 className={'nav_link'}>Login</h4>
                            </div>
                        </Link>
                    )
                }
            </div>
        </>
    }
    return (
        <nav className={'w-full h-max py-4 px-8 flex items-center justify-between'}>
            <Link href={"/"}>
                <div className={'w-max flex-grow cursor-pointer'}>
                    <Image src={'/images/shopping-bag.svg'} alt={'logo'} width={90} height={90} objectFit={'contain'}
                           prefix={'responsive'}/>
                </div>
            </Link>
            {/* Navbar Links and options */}
            <div className="hidden sm:flex items-center justify-between flex-grow">
                <HeaderOptions/>
            </div>
            <AiOutlineMenu
                className={'w-16 h-16 bg-blue-500 sm:hidden text-sky-50 rounded-full p-2.5 text-3xl cursor-pointer transition-all transform hover:scale-110'}
                onClick={() => {
                    setIsMenuOpen(true)
                }}/>
            <div
                className={`position-center z-50 ${isMenuOpen ? "w-full h-full" : "w-0 h-0"} transition-all ease-in-out duration-300 flex flex-col  items-center justify-center sm:hidden bg-blue-500  `}>
                {
                    isMenuOpen && <>
                        <HeaderOptions isSmallScreen={true}/>
                        <AiOutlineClose
                            className={'absolute top-8 right-12 w-16 h-16 bg-sky-50 text-blue-500 rounded-full p-2.5 text-3xl cursor-pointer transition-all transform hover:scale-110 '}
                            onClick={() => {
                                setIsMenuOpen(false)
                            }}/>
                    </>
                }
            </div>
        </nav>
    );
};

export default MyComponent;
