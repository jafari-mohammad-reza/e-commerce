import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { AuthWrapper, Button, Input } from "../../components/Auth-Styles";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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
    await axios
      .post("http://localhost:5000/api/v1/auth/email/forgot-password", {
        email,
      })
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Please check your email for reset password link",
          showConfirmButton: false,
          timer: 1000,
        });
        return setInterval(() => {
          window.location.href = "/login";
        }, 3000);
      })
      .catch((err) => {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.errors.message,
          showConfirmButton: false,
          timer: 4000,
        });
      });
  };
  return (
    <AuthWrapper onSubmit={(e) => sendForgotPasswordEmail(e)}>
      <h1>Forgot Password</h1>
      <hr />
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
