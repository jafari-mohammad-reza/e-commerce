import React, {useRef} from 'react';
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import axios from "../../axios";
import {useCookies} from "react-cookie";
import {client_authentication, Global_Error} from "../../conf/ConstantFunctions";

const VerifyAccount = () => {
    const code = useRef(null)
    const [cookies, setCookie, removeCookie] = useCookies(['verificationToken']);

    const router = useRouter()
    client_authentication({router})

    const resendCode = async () => {
        await axios.post("/api/v1/auth/email/resend-code/", {},).then(result => {
            console.log(result)
            if (result.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Congratulation",
                    text: "We just emailed you a new verification code, use it to active your account",
                    timer: 1500
                })

            }
        }).catch(err => {
            console.log(err)
            if (err.response.status === 400 || err.response.status === 404) {
                return Global_Error({message: "There is no verification code"})
            } else {
                return Global_Error({message: err.response.data.errors.message})
            }
        })

    }
    const submitHandler = async (e) => {
        e.preventDefault()
        if (!code.current.value) {
            return Global_Error({message: "Please insert the code we have sent you"})
        }
        if (code.current.value.length !== 10) {
            return Global_Error({message: "Make sure to insert exact same code we have sent you."})
        }
        await axios.post("/api/v1/auth/email/verify-account", {code: code.current.value}).then(result => {
            if (result.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Congratulation",
                    text: "Your account has been activated successfully. please login into your account next.",
                    timer: 1500
                })
                removeCookie("verificationToken")
                setInterval(() => {
                    return router.push("/auth/login")
                }, 1000)
            }
        }).catch(err => {
            if (err.response.status === 400 || err.response.status === 404) {
                return Global_Error({message: "Make sure to insert a valid code. click on resend link if you need a new code"})
            } else {
                return Global_Error({message: err.response.data.errors.message})
            }

        })


    }
    return (
        <div className={'flex items-center justify-center h-screen w-full'}>
            <form className='auth_form' onSubmit={submitHandler}>
                <h1 className={'text-2xl md:text-5xl  text-stone-200 mb-10'}>Verify your account</h1>

                <input type="text" placeholder={'Insert the code we have sent you.'} className={'auth_input'}
                       required={true}
                       ref={code}/>
                <button type="submit" className={'auth_button'}>Verify</button>
                <div className="my-10">
                    <h4 className={'auth_link '}>
                        Have not receive the code yet ?
                        <span className={'text-blue-300 font-bold mx-3 cursor-pointer'} onClick={resendCode}>Resend Code.</span>
                    </h4>
                </div>
            </form>
        </div>
    );
};

export default VerifyAccount;
