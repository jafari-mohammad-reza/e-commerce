import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  AuthWrapper,
  Button,
  GoogleButton,
  Input,
  SubLink,
} from "../../components/Auth-Styles";
import { EmailAuthPath } from "../../conf/constants";
import { PasswordRegex, SpecialCharacterRegex } from "../../conf/Regex";

function RegisterPage() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function register(e) {
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
          await axios
            .post(EmailAuthPath + "register", {
              email,
              username,
              password,
              confirmPassword,
            })
            .then(async (result) => {
              if (result.status === 201) {
                await Swal.fire({
                  icon: "success",
                  title: "Registered ✅",
                  text: "registered successfully , validate your account by the code we have sent for you.",
                  timer: 1700,
                  position: "top-right",
                });
                setTimeout(() => {
                  return (window.location = "/verify-account");
                }, 2000);
              }
            })
            .catch(async (error) => {
              console.log(error.response);
              if (error.response.status === 400) {
                return await Swal.fire({
                  icon: "error",
                  title: "User exist!",
                  text: "Please try to login into your account",
                  timer: 3000,
                  position: "top-right",
                });
              }
              return await Swal.fire({
                icon: "error",
                title: "Something happened!",
                text: error.response.data.message,
                timer: 3000,
                position: "top-right",
              });
            });
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
    <AuthWrapper onSubmit={(e) => register(e)}>
      <h1>Register</h1>
      <hr />

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

      <GoogleButton />
    </AuthWrapper>
  );
}

export default RegisterPage;
