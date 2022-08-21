import React, {useRef, useState} from 'react';
import Swal from "sweetalert2";
import {PASSWORD_PATTERN} from "../../conf/RegexPatterns";
import axios from "../../axios";
import {AiFillEye, AiOutlineArrowLeft} from "react-icons/ai";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {setCredits} from "../../app/features/authSlice";
import {useRouter} from "next/router";
import {Global_Error} from "../../conf/ConstantFunctions";

const Login = () => {

    const router = useRouter()
    // client_authentication({router})
    const email = useRef(null)
    const password = useRef(null)
    const rememberme = useRef(null)
    const dispatch = useDispatch()
    const [isForgotPass, setIsForgotPass] = useState(false)
    const forgotPassHandler = async (e) => {
        e.preventDefault()
        if (!email.current.value || !email.current.value.endsWith("@gmail.com" || "@yahoo.com" || "@hotmail.com")) {
            return Global_Error({message: "Make sure to insert a valid email"})
        }
        await axios.post("/api/v1/auth/email/forgot-password", {email: email.current.value}).then(result => {
            if (result.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "We have sent you reset password link. check your email",
                    position: "center",
                    showConfirmButton: true
                })
                setIsForgotPass(false)
            }
        }).catch(err => {
            if (err.response.scale === 404 || err.response.scale === 400) {
                return Global_Error({message: "Make sure to insert correct email address"})
            } else {
                return Global_Error({message: err.response.data.errors.message})
            }
        })
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if (!email.current.value || !password.current.value) {
            return Global_Error({message: "All fields are required"})
        }
        if (!email.current.value.endsWith("@gmail.com" || "@yahoo.com" || "@hotmail.com")) {
            return Global_Error({message: "Please enter a valid email"})
        }

        if (!password.current.value.match(PASSWORD_PATTERN)) {
            return Global_Error({message: "Password must contain at least one lowercase letter, one uppercase letter and one number"})
        }
        await axios.post("/api/v1/auth/email/login", {
            email: email.current.value, password: password.current.value, rememberme: rememberme.current.checked,
        }).then(result => {
            if (result.status === 200) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("user_info", JSON.stringify(result.data.credentials))
                }
                dispatch(setCredits(result.data.credentials))

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "You have successfully logged in",
                    position: "top-right",
                    timer: 1500
                })
                setInterval(() => {
                    router.push("/")
                }, 700)
            }


        }).catch(err => {
            console.log(err)
            if (err.response.status === 404) {
                return Global_Error({message: "Email or password is incorrect"})
            }
            if (err.response.status === 400) {
                return Global_Error({message: "Your account is not verified yet. Please check your email"})
            }
            if (err.response.status === 403) {
                return Global_Error({message: "Your account is blocked. Contact admin"})
            } else {

                return Global_Error({message: err.response.data.message})
            }
        })


    }
    return (<div className={'flex items-center justify-center h-screen w-full shadow shadow-2xl '}>
        {isForgotPass && <div
            className={'absolute  flex items-center justify-center h-screen w-full bg-white bg-opacity-40 z-50  '}>
            <form className={'auth_form relative'} onSubmit={forgotPassHandler}>
                <h1 className={'text-2xl md:text-5xl  text-stone-200 mb-10 '}>Send reset password link</h1>
                <AiOutlineArrowLeft
                    className={'text-5xl text-blue-500 absolute top-14 left-16 cursor-pointer transition-all transform hover:scale-125 '}
                    onClick={() => setIsForgotPass(false)}/>
                <input type="email" className={'auth_input'}
                       required={true}
                       ref={email}
                       placeholder={'Insert email of the account that you have forgot its password.'}/>
                <button type="submit" className={'auth_button'}>Send link</button>
            </form>
        </div>}
        <form onSubmit={submitHandler}
              className={'auth_form'}>
            <h1 className={'text-2xl md:text-5xl  text-stone-200 mb-10'}>Login</h1>

            <input type="email" name={'email'} ref={email}
                   className={'auth_input'}
                   placeholder={'Your email.'} required={true}
            />

            <div className="w-full relative">
                <input type="password" name={'password'} ref={password}
                       className={'auth_input'}
                       placeholder={'Your password.'} required={true}
                />


                <AiFillEye className={'auth_eye'} onClick={() => {
                    password.current.type === "password" ? password.current.type = "text" : password.current.type = "password"
                }}/>

            </div>
            <div className={'flex items-center space-x-3.5 my-3 place-self-start w-max'}>
                <span className={'text-2xl text-blue-500'}>Remember Me</span>
                <input type="checkbox" name={'rememberme'} ref={rememberme} className={'w-8 h-8 rounded-lg  '}/>
            </div>


            <button type='submit'
                    className={'auth_button'}>Login
                Now!
            </button>
            <div className="flex flex-col items-center justify-center mt-10">
                <h4 className={'auth_link'}>
                    Does not have an account? <Link href={'register'}>
                        <span className={'text-blue-300 font-bold'}>
                                                    Register here.
                        </span>
                </Link>
                </h4>
                <h4 className="auth_link">
                    Forgot your password ? <span onClick={() => setIsForgotPass(true)}>
                    Click here
                </span>
                </h4>
                <h4 className={'auth_link'}>
                    <Link href={'/auth/mobile_login'}>
                        <span className={'text-blue-300 font-bold'}>
                                                    Login by mobile number.
                        </span>
                    </Link>
                </h4>

            </div>
        </form>
    </div>);

};

export default Login;
