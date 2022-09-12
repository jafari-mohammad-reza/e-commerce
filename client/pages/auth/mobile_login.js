import React, {useRef, useState} from 'react';
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "../../axios";
import {useRouter} from "next/router";
import {Global_Error} from "../../conf/ConstantFunctions";
import {setCredits} from "../../app/features/authSlice";
import {useDispatch} from "react-redux";

const MobileLogin = () => {
    const [loginStage, setLoginStage] = useState("get-otp")
    const mobile = useRef(null)
    const otp = useRef(null)
    const router = useRouter()
    const dispatch = useDispatch()
    const resendCode = async () => {
        if (!mobile.current.value) {
            return Global_Error({message: "Please insert your mobile number first"})
        }
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if (!mobile.current.value) {
            return Global_Error({message: "Please insert your mobile number first"})
        }
        if (loginStage === "get-otp") {
            await axios.post("api/v1/auth/mobile/get-otp", {mobile: mobile.current.value}).then(result => {
                if (result.status === 200) {
                    setLoginStage("validate-otp")
                }
            }).catch(err => {
                console.log(err)
                return Global_Error({message: "Something went wong."})
            })
        } else if (loginStage === "validate-otp") {
            if (!otp.current.value) {
                return Global_Error({message: "Please insert the code we have sent yo your phone"})
            }
            await axios.post("/api/v1/auth/mobile/validate-otp", {
                mobile: mobile.current.value,
                otp: otp.current.value
            }).then(result => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("user_info", JSON.stringify(result.data.credentials))
                }
                dispatch(setCredits(result.data.credentials))
                if (result.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "you have been logged in successfully.",
                        timer: 1500
                    })
                    return router.push("/")
                }
            }).catch(err => {
                console.log(err)
                if (err.response.status === 404) {
                    return Global_Error({message: "Please refresh page and insert you number again"})
                }
                return Global_Error({message: err.response.data.errors.message})
            })
        }
    }


    return (
        <div className={'flex items-center justify-center h-screen w-full'}>
            <form className="auth_form" onSubmit={submitHandler}>
                <h1 className={'text-2xl md:text-5xl  text-stone-200 mb-10'}>Login By mobile number</h1>
                <input type="tel" className={'auth_input'} placeholder={'Your mobile number'} required={true}
                       ref={mobile}/>
                {loginStage === "validate-otp" &&
                    <>
                        <input type="text" className={'auth_input'}
                               placeholder={'The code we send to your mobile number'}
                               required={true}
                               ref={otp}
                        />
                        <h4 className={'auth_link'}>
                            Didnt receive any code yet ?
                            <Link href={'/auth/login'}>
                                <span className={'text-blue-300 font-bold mx-3'}>Resend code</span>
                            </Link>
                        </h4>

                    </>
                }
                <button type={'submit'} className={'auth_button'}>
                    {loginStage === 'get-otp' ? "Get code" : "Verify code"}
                </button>
                <h4 className={'auth_link'}>
                    <Link href={'/auth/login'}>
                        <span className={'text-blue-300 font-bold'}>Login by email.</span>
                    </Link>
                </h4>
            </form>
        </div>
    );
};

export default MobileLogin;
