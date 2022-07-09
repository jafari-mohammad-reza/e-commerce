import React, {useState} from "react";
import Swal from "sweetalert2";
import {AuthWrapper, Button, GoogleButton, Input, SubLink,} from "../../components/Auth-Styles";
import {PasswordRegex, SpecialCharacterRegex} from "../../conf/Regex";
import {useRegisterMutation} from "../../app/features/auth/authApiSlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

function RegisterPage() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [register] = useRegisterMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function handleSubmit(e) {
        e.preventDefault();
        if (password.match(PasswordRegex) && password === confirmPassword) {
            if (
                username.length >= 8 &&
                username.length <= 12 &&
                !SpecialCharacterRegex.test(username)
            ) {
                if (
                    email.endsWith("@gmail.com") ||
                    email.endsWith("@yahoo.com") ||
                    email.endsWith("@email.com")
                ) {
                    try {
                        const userData = await register({
                            username,
                            email,
                            password,
                            confirmPassword
                        }).unwrap();
                        if (userData.success) {
                            await Swal.fire({
                                icon: "success",
                                title: "Registered",
                                timer: 500,
                                position: "top-right",
                            });
                            setTimeout(() => {
                                navigate("/verify-account", {replace: true})
                            }, 600)
                        }
                    } catch (error) {
                        await Swal.fire({
                            icon: "error",
                            title: error?.data?.errors?.message,
                            timer: 3000,
                            position: "top-right",
                        });
                    }
                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "Only gmail , yahoo and email domains are acceptable",
                        timer: 3000,
                        position: "top-right",
                    });
                }
            } else {
                await Swal.fire({
                    icon: "error",
                    title:
                        "Username must be between 8 to 12 character and does not contain any special character",
                    timer: 3000,
                    position: "top-right",
                });
            }
        } else {
            await Swal.fire({
                icon: "error",
                title:
                    "Password must be between 8 to 16 characters and contains at lease one uppercase,lowercase and numerical character.",
                timer: 3000,
                position: "top-right",
            });
        }
    }

    return (
        <AuthWrapper onSubmit={(e) => handleSubmit(e)}>
            <h1>Register</h1>
            <hr/>

            <div>
                <Input
                    name="username"
                    type={"string"}
                    required
                    placeholder="username"
                    onChange={(e) => setUserName(e.target.value)}
                    value={username}
                />
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
