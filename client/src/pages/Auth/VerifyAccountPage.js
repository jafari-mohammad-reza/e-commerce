import axios from "axios";
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import Swal from "sweetalert2";
import {AuthWrapper, Button, Input, SubLink,} from "../../components/Auth-Styles";

function VerifyAccountPage() {
    const [code, setCode] = useState("");
    const [cookies, setCookie] = useCookies();

    async function resendCode() {
        await axios
            .post(
                "http://localhost:5000/auth/resend-code",
                {},
                {headers: {Authorization: "Bearer" + cookies["access-token"]}}
            )
            .then((result) => {
                try {
                    return Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "code sent successfully",
                        showConfirmButton: false,
                        timer: 1000,
                    });
                } catch (err) {
                    console.log(err);
                    return Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: `${err?.response?.data?.message}`,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            });
    }

    const validateAccount = async (e) => {
        e.preventDefault();
        if (code === "") {
            return Swal.fire({
                position: "top-end",
                icon: "error",
                title: "please enter your verification code",
                showConfirmButton: false,
                timer: 1000,
            });
        }
        try {
            await axios
                .post(
                    "http://localhost:5000/auth/verify-account",
                    {code},
                    {
                        headers: {
                            Authorization: "Bearer" + cookies["access-token"],
                        },
                    }
                )
                .then((result) => {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "account verified successfully",
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    return (window.location.href = "/login");
                })
                .catch((err) => {
                    console.error(err);
                    return Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: `${err?.response?.data?.message}`,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                });
        } catch (error) {
            console.error(error.message);
        }
    };
    return (
        <AuthWrapper onSubmit={(e) => validateAccount(e)}>
            <h1>Verify Account</h1>
            <hr/>
            <Input
                type={"text"}
                placeholder="Insert the code we sent to your email."
                onChange={(e) => setCode(e.target.value)}
                value={code}
            />
            <Button type="submit">Verify</Button>
            <SubLink to={"#"}>
                <h5>haven't received the code yet?</h5>{" "}
                <span onClick={() => resendCode()}>Resend Code.</span>
            </SubLink>
        </AuthWrapper>
    );
}

export default VerifyAccountPage;
