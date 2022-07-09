import React, {useState} from "react";
import Swal from "sweetalert2";
import {AuthWrapper, Button, Input} from "../../components/Auth-Styles";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useGetResetPasswordMutation} from "../../app/features/auth/authApiSlice";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [getResetPassword] = useGetResetPasswordMutation()
    const sendForgotPasswordEmail = async (e) => {
        e.preventDefault();
        if (email === "") {
            return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter your email address",
                showConfirmButton: false,
                timer: 1000,
            });
        }
        try {
            const result = await getResetPassword({email})
            console.log(result)
            if (result?.data?.success) {
                return await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Please check your email for reset password link",
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
            if (result?.error) {
                const {data: error} = result?.error;
                console.log(error)
                return await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.errors.message,
                    showConfirmButton: false,
                    timer: 4000,
                });
            }
        } catch (error) {
            return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.data?.errors?.message,
                showConfirmButton: false,
                timer: 4000,
            });
        }

    };
    return (
        <AuthWrapper onSubmit={(e) => sendForgotPasswordEmail(e)}>
            <h1>Forgot Password</h1>
            <hr/>
            <Input
                type={"email"}
                placeholder="enter your email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <Button type="submit">Send</Button>
        </AuthWrapper>
    );
}

export default ForgotPasswordPage;
