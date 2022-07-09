import React from "react";
import {AuthWrapper, Button, Input} from "../../components/Auth-Styles";
import {useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import {PasswordRegex} from "../../conf/Regex";
import {useCookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {useResetPasswordMutation} from "../../app/features/auth/authApiSlice";
import {logout} from "../../app/features/auth/authSlice";

function ResetPasswordPage() {
    const [cookies, setCookie, removeCookie] = useCookies([
        "refresh_token",
    ]);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [resetPassword] = useResetPasswordMutation()

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const params = useParams();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resetPasswordToken = params.token;
        if (password.match(PasswordRegex)) {
            if (password === confirmPassword) {
                try {
                    const result = await resetPassword({password, confirmPassword, resetPasswordToken});
                    console.log(result)
                    if (result?.data?.success) {
                        removeCookie("refresh_token");
                        dispatch(logout())
                        await Swal.fire({
                            icon: "success",
                            title: "Success ✅",
                            text: "Your password has been changed successfully",
                            timer: 1000,
                            location: "top-right",
                        });
                        setTimeout(() => {
                            navigate("/login")
                        }, 15000);
                    }
                    if (result?.error) {
                        return Swal.fire({
                            icon: "error",
                            title: "Ooops",
                            text: result?.error?.data?.errors?.message,
                            timer: 1500,
                            location: "top-right",
                        });
                    }
                } catch (error) {
                    console.log(error)
                    // return Swal.fire({
                    //     icon: "error",
                    //     title: "Ooops",
                    //     text: error?.response?.errors?.message,
                    //     timer: 1500,
                    //     location: "top-right",
                    // });
                }
            } else {
                return await Swal.fire({
                    icon: "error",
                    title: "Wrong password!",
                    text: "Both password and its confirmation should be exactly same.",
                    position: "top-right",
                    timer: 2000,
                });
            }
        } else {
            return await Swal.fire({
                icon: "error",
                title: "Not a valid password",
                position: "top-right",
                timer: 2000,
            });
        }
    };
    return (
        <AuthWrapper onSubmit={(e) => handleSubmit(e)}>
            <h1>Reset Password</h1>
            <hr/>
            <Input
                type="password"
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <Input
                type="password"
                placeholder="Your password confirmation"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
            />
            <Button type="submit">Reset</Button>
        </AuthWrapper>
    );
}

export default ResetPasswordPage;
