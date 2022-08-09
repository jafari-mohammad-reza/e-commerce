import React, {useState} from "react";
import Swal from "sweetalert2";
import {AuthWrapper, Button, Input, SubLink,} from "../../components/Auth-Styles";
import {MobileRegex} from "../../conf/Regex";
import {useGetOtpMutation, useVerifyOtpMutation} from "../../app/features/auth/authApiSlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../app/features/auth/authSlice";

function MobileLoginPage() {
    const [stage, setStage] = useState("get-otp");
    const [mobile, setMobile] = useState();
    const [code, setCode] = useState();
    const [getOtp] = useGetOtpMutation()
    const [verifyOtp] = useVerifyOtpMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function login(e) {
        e.preventDefault();
        if (!mobile.match(MobileRegex)) {
            return await Swal.fire({
                icon: "error",
                title: "Not valid mobile!",
                timer: 3000,
                position: "top-right",
            });
        }
        if (stage === "get-otp") {
            try {
                const getOtpResult = await getOtp({mobile})
                if (getOtpResult?.data?.success) {
                    await Swal.fire({
                        icon: "success",
                        title: "Sent ✅",
                        text: "We have sent a code to you mobile to validate your self.",
                        timer: 500,
                        position: "top-right",
                    });
                    setTimeout(() => {
                        setStage("validate-otp");
                    }, 700);
                }
                if (getOtpResult?.error) {
                    const {data} = getOtpResult?.error
                    return await Swal.fire({
                        icon: "error",
                        title: "Something happened!",
                        text: data?.errors?.message,
                        timer: 3000,
                        position: "top-right",
                    });
                }
            } catch (error) {
                return await Swal.fire({
                    icon: "error",
                    title: "Something happened!",
                    text: error?.data?.errors?.message,
                    timer: 3000,
                    position: "top-right",
                });
            }
        } else if (stage === "validate-otp") {
            if (code && code.length === 6) {
                try {
                    const verificationResult = await verifyOtp({mobile, otp: code}).unwrap()
                    console.log(verificationResult)
                    if (verificationResult?.success) {
                        console.log(verificationResult)
                        dispatch(setCredentials({...verificationResult.credentials}))
                        await Swal.fire({
                            icon: "success",
                            title: "Logged In ✅",
                            timer: 500,
                            position: "top-right",
                        });
                        setTimeout(() => {
                            navigate("/")
                        }, 700);
                    }
                    if (verificationResult?.error) {
                        const {data} = verificationResult?.error
                        console.log(data)
                        return await Swal.fire({
                            icon: "error",
                            title: "Something happened!",
                            text: data?.errors?.message,
                            timer: 3000,
                            position: "top-right",
                        });
                    }
                } catch (error) {
                    console.log(error)
                    return await Swal.fire({
                        icon: "error",
                        title: "Something Bad happened!",
                        text: error?.data?.errors?.message,
                        timer: 3000,
                        position: "top-right",
                    });
                }
            } else {
                return await Swal.fire({
                    icon: "error",
                    title: "UnValid Code.",
                    text: "code cannot be empty or more or less than 6 number.",
                    timer: 3000,
                    position: "top-right",
                });
            }
        }
    }

    return (
        <AuthWrapper onSubmit={(e) => login(e)}>
            <h1>Login By Mobile</h1>
            <hr/>
            <Input
                placeholder="Mobile number"
                type={"tel"}
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
            />
            {stage === "validate-otp" && (
                <Input
                    placeholder="OTP code"
                    type={"string"}
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                />
            )}

            <Button type="submit">Login</Button>

            <SubLink to={"/login-mobile"}>
                <h5>Login By Email</h5>
            </SubLink>
        </AuthWrapper>
    );
}

export default MobileLoginPage;
