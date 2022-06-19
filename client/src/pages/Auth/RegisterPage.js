import axios from "axios";
import React, {useState} from "react";
import Swal from "sweetalert2";
import {AuthWrapper, Button, GoogleButton, Input, SubLink,} from "../../components/Auth-Styles";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const register = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "passwords do not match",
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
            const passwordRegex = /^[a-zA-Z0-9]{6,16}$/;
            if (!passwordRegex.test(password)) {
                return Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title:
                        "password must be 6-16 characters long and contain only letters and numbers",
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
            const userData = {
                email,
                password,
                confirmPassword,
            };
            const result = await axios.post(
                "http://localhost:5000/auth/register-email",
                userData,
                {withCredentials: true}
            );

            if (result.status === 201 || result.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "user has been registered successfully",
                    showConfirmButton: false,
                    timer: 1000,
                });
                setTimeout(() => {
                    window.location.href = "/verify-account";
                }, 1500);
            }
        } catch (error) {
            console.log(error);
            if (error.request.status === 401) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "there is already a user with this credentials",
                    showConfirmButton: false,
                    timer: 1000,
                });
                setTimeout(() => {
                    return (window.location.href = "/login");
                }, 1000);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "there was an error",
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        }
    };
    return (
        <AuthWrapper onSubmit={(e) => register(e)}>
            <h1>Register</h1>
            <hr/>

            <div>
                <Input
                    name="email"
                    type={"email"}
                    required
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input
                    name="password"
                    type={"password"}
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <Input
                    name="confirmPassword"
                    type={"password"}
                    required
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                />
            </div>

            <Button type="submit">Register</Button>

            <SubLink to="/login">
                <h5>Already a user ?</h5> <span>Login</span>
            </SubLink>

            <GoogleButton/>
        </AuthWrapper>
    );
}

export default RegisterPage;
