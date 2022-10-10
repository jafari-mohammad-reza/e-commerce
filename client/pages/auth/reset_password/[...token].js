import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import axios from "../../../axios";
import {AiFillEye} from "react-icons/ai";
import {PASSWORD_PATTERN} from "../../../conf/RegexPatterns";
import {Global_Error} from "../../../conf/ConstantFunctions";

const ResetPassword = () => {
    const router = useRouter()
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const [token, setToken] = useState(null)
    useEffect(() => {
        setToken(router.query.token)
    }, [router.query]);
    const submitHandler = async (e) => {
        e.preventDefault()
        if (!password.current.value.match(PASSWORD_PATTERN)) {
            return Global_Error("Password must contain at least one lowercase letter, one uppercase letter and one number")
        } else if (password.current.value !== confirmPassword.current.value) {
            return Global_Error("Make sure that the new password and its confirmation are the same")
        }
        await axios.post(`/api/v1/auth/email/reset-password/${token[0]}`, {
            password: password.current.value,
            confirmPassword: confirmPassword.current.value
        }).then(async (result) => {
            if (result.status === 200) {
               await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Your password has been changed successfully.",
                    position: "top-right",
                    timer: 2000
                }).then(async () => {
await                 router.push("/auth/login")

               })
            }
        }).catch(err => {
            return Global_Error(err.response.data.errors.message)
        })
    }
    return (
        <div className={'flex items-center justify-center h-screen w-full'}>
            <form className="auth_form" onSubmit={submitHandler}>
                <h1 className={'text-2xl md:text-5xl  text-stone-200 mb-10'}>Reset password</h1>
                <div className="w-full relative">
                    <input type="password" name={'password'} ref={password}
                           className={'auth_input'}
                           placeholder={'Your new password.'} required={true}
                    />
                    <AiFillEye className={'auth_eye'} onClick={() => {
                        password.current.type === "password" ? password.current.type = "text" : password.current.type = "password"
                    }}/>
                </div>
                <div className="w-full relative">
                    <input type="password" name={'password'} ref={confirmPassword}
                           className={'auth_input'}
                           placeholder={'Your new password confirmation.'} required={true}
                    />
                    <AiFillEye className={'auth_eye'} onClick={() => {
                        confirmPassword.current.type === "password" ? confirmPassword.current.type = "text" : confirmPassword.current.type = "password"
                    }}/>

                </div>

                <button type="submit" className={'auth_button'}>Reset your password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
