import React, {useState} from "react";
import {AuthWrapper, Button, Input, SubLink,} from "../../components/Auth-Styles";
import Swal from "sweetalert2";
import {setCredentials} from "../../app/features/auth/authSlice";
import {PasswordRegex} from "../../conf/Regex";
import {useNavigate} from "react-router-dom";
import {useLoginMutation} from "../../app/features/auth/authApiSlice";
import {useDispatch} from "react-redux";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [login, {isLoading, isError, error, status, isSuccess}] =
        useLoginMutation();
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password.match(PasswordRegex)) {
            if (
                email.endsWith("@gmail.com") ||
                email.endsWith("@yahoo.com") ||
                email.endsWith("@email.com")
            ) {
                try {
                    const userData = await login({email, password}).unwrap();
                    if (userData.success) {
                        const {credentials} = userData;
                        dispatch(setCredentials({...credentials}))
                        await Swal.fire({
                            icon: "success",
                            title: "Logged IN",
                            timer: 500,
                            position: "top-right",
                        });
                        setTimeout(() => {
                            navigate("/", {replace: true})
                        }, 600)
                    }
                } catch (error) {
                    return await Swal.fire({
                        icon: "error",
                        title: error?.data?.errors?.message,
                        timer: 3000,
                        position: "top-right",
                    });
                }
            } else {
                return await Swal.fire({
                    icon: "error",
                    title: "Only gmail , yahoo and email domains are acceptable",
                    timer: 3000,
                    position: "top-right",
                });
            }
        } else {
            return await Swal.fire({
                icon: "error",
                title:
                    "Password must be between 8 to 16 characters and contains at lease one uppercase,lowercase and numerical character.",
                timer: 3000,
                position: "top-right",
            });
        }
    };
    return (
        <AuthWrapper onSubmit={(e) => submitHandler(e)}>
            <h1>Login</h1>
            <hr/>
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
            <Button type="submit">Login</Button>

            <SubLink to="/register">
                <h5>Not a user yet?</h5> <span>Register</span>
            </SubLink>
            <SubLink to="/forgot-password">
                <h5>Forgot password</h5> <span>Reset it.</span>
            </SubLink>
            <SubLink to={"/login-mobile"}>
                <span>Login By mobile</span>
            </SubLink>
        </AuthWrapper>
    );
}

export default LoginPage;
