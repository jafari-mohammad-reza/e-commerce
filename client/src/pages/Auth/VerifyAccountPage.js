import axios from "axios";
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import Swal from "sweetalert2";
import {AuthWrapper, Button, Input, SubLink,} from "../../components/Auth-Styles";
import {EmailAuthPath} from "../../conf/constants";
import {useVerifyAccountMutation} from "../../app/features/auth/authApiSlice";
import {useNavigate} from "react-router-dom";

function VerifyAccountPage() {
    const [code, setCode] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["verificationToken"]);
    const [verify] = useVerifyAccountMutation()
    const navigate = useNavigate()

    async function resendCode() {
        await axios
            .post(EmailAuthPath + "resend-code", {}, {withCredentials: true})
            .then(async (result) => {
                if (result.status === 200) {
                    return await Swal.fire({
                        icon: "success",
                        title: "Sent ✅",
                        position: "top-right",
                        timer: 3000,
                    });
                }
            })
            .catch(async (error) => {
                console.log(error);
                if (error.response.status === 401) {
                    await Swal.fire({
                        icon: "error",
                        title: "Not valid Token",
                        position: "top-right",
                        timer: 3000,
                    });
                } else {
                    await Swal.fire({
                        icon: "error",
                        text: error.response.data.errors.message,
                        position: "top-right",
                        timer: 3000,
                    });
                }
            });
    }

    const validateAccount = async (e) => {
        e.preventDefault();
        if (code === "" || code.length > 10) {
            return await Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Wrong code",
                showConfirmButton: false,
                timer: 1000,
            });
        }

        try {
            const result = await verify({code})
            console.log(result)
            if (result.data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Done ✅",
                    position: "top-right",
                    timer: 500,
                });
                removeCookie("verificationToken");
                setTimeout(() => {
                    navigate("/login")
                }, 700);
            }
            if (result.error) {
                return await Swal.fire({
                    icon: "error",
                    text: result?.error?.data?.errors?.message,
                    position: "top-right",
                    timer: 3000,
                });
            }
        } catch (error) {

            if (error?.data?.response === 401 || error?.data?.response === 404) {
                return await Swal.fire({
                    icon: "error",
                    text: "Not a valid code",
                    position: "top-right",
                    timer: 3000,
                });
            } else {
                return await Swal.fire({
                    icon: "error",
                    text: error?.data?.errors?.message,
                    position: "top-right",
                    timer: 3000,
                });
            }

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
