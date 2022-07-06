import React, { useState } from "react";
import { useCookies } from "react-cookie";
import {
  AuthWrapper,
  Button,
  GoogleButton,
  Input,
  SubLink,
} from "../../components/Auth-Styles";
import Swal from "sweetalert2";
import axios from "axios";
import { EmailAuthPath, MobileAuthPath } from "../../conf/constants";
import { PasswordRegex, MobileRegex } from "../../conf/Regex";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e) => {
    e.preventDefault();
    if (password.match(PasswordRegex)) {
      if (
        email.endsWith("@gmail.com") ||
        email.endsWith("@yahoo.com") ||
        email.endsWith("@email.com")
      ) {
        await axios
          .post(EmailAuthPath + "login", {
            email,
            password,
          })
          .then(async (result) => {
            if (result.status === 200) {
              await Swal.fire({
                icon: "success",
                title: "LoggedIn ✅",
                timer: 1700,
                position: "top-right",
              });
              setTimeout(() => {
                return (window.location = "/");
              }, 2000);
            }
          })
          .catch(async (error) => {
            console.log(error.response);
            if (error.response.status === 404) {
              return await Swal.fire({
                icon: "error",
                title: "Wrong credential!",
                text: "Email and password don't match",
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
    <AuthWrapper onSubmit={(e) => login(e)}>
      <h1>Login</h1>
      <hr />
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
