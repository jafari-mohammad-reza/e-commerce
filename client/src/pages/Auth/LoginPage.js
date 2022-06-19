import React, {useState} from "react";
import {useCookies} from "react-cookie";
import {AuthWrapper, Button, GoogleButton, Input, SubLink,} from "../../components/Auth-Styles";
import Swal from "sweetalert2";
import axios from "axios";

function LoginPage() {
    const [cookies, setCookie] = useCookies();
    const [loginMethod, setLoginMethod] = useState("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const login = async (e) => {
        e.preventDefault();
        if (loginMethod === "email") {
            if (email === "" || password === "") {
                return Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "please enter your email and password",
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
            if (!password.match(/[a-z][a-z0-9]/gi)) {
                return Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "please enter a valid password",
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
            try {
                const loginData = {
                    email,
                    password,
                };
                await axios
                    .post("http://localhost:5000/auth/login-email", loginData, {
                        withCredentials: true,
                    })
                    .then((result) => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "login successful",
                            showConfirmButton: false,
                            timer: 1000,
                        });
                        return setTimeout(() => {
                            window.location.href = "/";
                        }, 2500);
                    })
                    .catch((err) => {
                        console.log(err);
                        if (err.response.status === 401) {
                            Swal.fire({
                                position: "top-end",
                                icon: "warning",
                                title:
                                    "your email is not verified yet verify it by code sent to your email",
                                showConfirmButton: false,
                                timer: 1000,
                            });
                            return setTimeout(() => {
                                window.location.href = "/verify-account";
                            }, 2500);
                        }
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: err.response.data.message,
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    });
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await axios
                    .post("http://localhost:5000/auth/login-mobile", {mobile})
                    .then((result) => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "login successful",
                            showConfirmButton: false,
                            timer: 1000,
                        });
                        return setTimeout(() => {
                            window.location.href = "/validate-otp";
                        }, 2500);
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: err.response.data.message,
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    });
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <AuthWrapper onSubmit={(e) => login(e)}>
            <h1>Login</h1>
            <hr/>
            {loginMethod === "email" ? (
                <div>
                    <Input
                        placeholder="Email"
                        type={"email"}
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
                </div>
            ) : (
                <Input
                    name="mobile"
                    type={"tel"}
                    required
                    placeholder="Mobile Phone"
                    onChange={(e) => setMobile(e.target.value)}
                    value={mobile}
                />
            )}
            <Button type="submit">Login</Button>

            <SubLink to="/register">
                <h5>Not a user yet?</h5> <span>Register</span>
            </SubLink>
            <SubLink to="/forgot-password">
                <h5>Forgot password</h5> <span>Reset it.</span>
            </SubLink>
            <SubLink to={"#"}>
        <span
            onClick={() =>
                setLoginMethod((prevMethod) =>
                    prevMethod === "email" ? "mobile" : "email"
                )
            }
        >
          {loginMethod === "email" ? "Login with mobile" : "Login with email"}
        </span>
            </SubLink>

            <GoogleButton/>
        </AuthWrapper>
    );
}

export default LoginPage;
