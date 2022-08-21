import React, {useRef} from 'react';
import Swal from "sweetalert2";
import axios from "../../axios";
import {useRouter} from "next/router";
import Link from "next/link";
import {AiFillEye} from "react-icons/ai";
import {PASSWORD_PATTERN} from "../../conf/RegexPatterns";
import {Global_Error} from "../../conf/ConstantFunctions";

const Register = () => {
    const username = useRef(null)
    const email = useRef(null)
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const router = useRouter()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!username.current.value || !email.current.value || !password.current.value || !confirmPassword.current.value) {
            return Global_Error({message: "All fields are required"})
        }
        if (!email.current.value.endsWith("@gmail.com" || "@yahoo.com" || "@hotmail.com")) {
            return Global_Error({message: "Please enter a valid email"})
        }
        if (username.current.value.length < 3 || username.current.value.length > 16) {
            return Global_Error({message: "Username must be between 3 and 16 characters"})
        }
        if (password.current.value !== confirmPassword.current.value) {
            return Global_Error({message: "Passwords do not match"})
        }
        if (!password.current.value.match(PASSWORD_PATTERN)) {
            return Global_Error({message: "Password must contain at least one lowercase letter, one uppercase letter and one number"})
        }
        await axios.post("/api/v1/auth/email/register", {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value,
        }).then(result => {
            console.log(result.data)
            if (result.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "You have successfully registered",
                    position: "top-right",
                    timer: 1500
                })
                setInterval(() => {
                    router.push("/auth/verify_account")
                }, 700)
            }
        }).catch(err => {
            if (err.response.status === 400) {
                return Global_Error({message: "Email or username already exists"})
            } else {
                return Global_Error({message: "Something went wrong"})
            }
        })


    }
    return (
        <div className={'flex items-center justify-center h-screen w-full shadow shadow-2xl '}>
            <form onSubmit={submitHandler}
                  className={'auth_form'}>
                <h1 className={'text-2xl md:text-5xl  text-stone-200 mb-10'}>Register</h1>
                <input type="text" name={'username'} ref={username}
                       className={'auth_input'}
                       placeholder={'Your username.'}
                       required={true}
                />
                <input type="email" name={'email'} ref={email}
                       className={'auth_input'}
                       placeholder={'Your email.'} required={true}
                />

                <div className="w-full relative">
                    <input type="password" name={'password'} ref={password}
                           className={'auth_input'}
                           placeholder={'Your password.'} required={true}
                    />


                    <AiFillEye className={'auth_eye'} onClick={
                        () => {
                            password.current.type === "password" ? password.current.type = "text" : password.current.type = "password"
                        }
                    }/>

                </div>


                <div className='w-full  relative'>
                    <input type="password" name={'confirmPassword'} ref={confirmPassword}
                           className={'auth_input'}
                           placeholder={'Confirm password.'} required={true}/>
                    <AiFillEye className={'auth_eye'} onClick={
                        () => {
                            confirmPassword.current.type === "password" ? confirmPassword.current.type = "text" : confirmPassword.current.type = "password"
                        }
                    }/>
                </div>
                <button type='submit'
                        className={'auth_button'}>Register
                    Now!
                </button>
                <div className="flex flex-col items-center justify-center mt-10">
                    <h4 className={'text-2xl text-stone-200 '}>
                        Already have an account? <Link href={'login'}>
                        <span className={'text-blue-300 font-bold'}>
                                                    Login here.
                        </span>
                    </Link>
                    </h4>
                </div>
            </form>
        </div>
    );
};

export default Register;
