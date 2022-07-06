import React from "react";
import { AuthWrapper, Button, Input } from "../../components/Auth-Styles";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { PasswordRegex } from "../../conf/Regex";
import { EmailAuthPath } from "../../conf/constants";
import { useCookies } from "react-cookie";

function ResetPasswordPage() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const params = useParams();
  const resetPassword = async (e) => {
    e.preventDefault();
    const resetPasswordToken = params.token;
    if (password.match(PasswordRegex)) {
      if (password === confirmPassword) {
        await axios
          .post(EmailAuthPath + `reset-password/${resetPasswordToken}`, {
            password,
            confirmPassword,
          })
          .then(async (result) => {
            if (result.status === 200) {
              removeCookie("access_token");
              removeCookie("refresh_token");
              await Swal.fire({
                icon: "success",
                title: "Success ✅",
                text: "Your password has been changed successfully",
                timer: 1500,
                location: "top-right",
              });
              setTimeout(() => {
                return (window.location = "/login");
              }, 2000);
            }
          })
          .catch(async (error) => {
            if (error.response.status === 401) {
              return Swal.fire({
                icon: "error",
                title: "Ooops",
                text: "Not a valid token.",
                timer: 1500,
                location: "top-right",
              });
            } else if (error.response.status === 406) {
              return Swal.fire({
                icon: "error",
                title: "Ooops",
                text: "You have reached the maximum reset password attempt..",
                timer: 1500,
                location: "top-right",
              });
            } else if (error.response.status === 400) {
              return Swal.fire({
                icon: "error",
                title: "Ooops",
                text: "New password cannot be same as old one.",
                timer: 1500,
                location: "top-right",
              });
            } else {
              return Swal.fire({
                icon: "warning",
                title: "Ooops",
                text: "youdd",
                timer: 1500,
                location: "top-right",
              });
            }
          });
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
    <AuthWrapper onSubmit={(e) => resetPassword(e)}>
      <h1>Reset Password</h1>
      <hr />
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
