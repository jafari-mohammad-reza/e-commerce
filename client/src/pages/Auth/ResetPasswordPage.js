import React from "react";
import {AuthWrapper, Button, Input} from "../../components/Auth-Styles";
import {useParams} from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ResetPasswordPage() {
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const params = useParams();
    const resetPassword = async (e) => {
        e.preventDefault();
        const token = params.token;

        if (!password.match(/[a-z][a-z0-9]/gi)) {
            return Swal.fire({
                position: "top-end",
                icon: "error",
                title: "please enter a valid password",
                showConfirmButton: false,
                timer: 1000,
            });
        }
        if (password !== confirmPassword) {
            return Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Passwords are not the same",
                showConfirmButton: false,
                timer: 1000,
            });
        }
        if (password.length < 8 || password.length > 16) {
            return Swal.fire({
                position: "top-end",
                icon: "error",
                title: "password must be between 8 and 16 characters",
                showConfirmButton: false,
                timer: 1000,
            });
        }
        const resetData = {
            password,
            confirmPassword,
        };
        await axios
            .post(`http://localhost:5000/auth/reset-password/`, resetData, {
                headers: {
                    Authorization: "Bearer" + token,
                },
            })
            .then((result) => {
                console.log(result);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "password reset successful",
                    showConfirmButton: false,
                    timer: 1000,
                });
                return setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                return Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: err.response.data.message,
                    showConfirmButton: false,
                    timer: 1000,
                });
            });
    };
    return (
        <AuthWrapper onSubmit={(e) => resetPassword(e)}>
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
