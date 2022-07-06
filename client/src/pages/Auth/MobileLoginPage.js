import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  AuthWrapper,
  Button,
  Input,
  SubLink,
} from "../../components/Auth-Styles";
import { MobileAuthPath } from "../../conf/constants";
import { MobileRegex } from "../../conf/Regex";

function MobileLoginPage() {
  const [stage, setStage] = useState("get-otp");
  const [mobile, setMobile] = useState();
  const [code, setCode] = useState();
  async function login(e) {
    e.preventDefault();
    if (!mobile.match(MobileRegex)) {
      return await Swal.fire({
        icon: "error",
        title: "Not valid mobile!",
        timer: 3000,
        position: "top-right",
      });
    }
    if (stage === "get-otp") {
      await axios
        .post(MobileAuthPath + "get-otp", { mobile })
        .then(async (result) => {
          if (result.status === 200) {
            await Swal.fire({
              icon: "success",
              title: "Sent ✅",
              text: "We have sent a code to you mobile to validate your self.",
              timer: 1500,
              position: "top-right",
            });
            setTimeout(() => {
              setStage("validate-otp");
            }, 2000);
          }
        })
        .catch(async (error) => {
          console.log(error);
          return await Swal.fire({
            icon: "error",
            title: "Something happened!",
            text: error.response.data.errors.message,
            timer: 3000,
            position: "top-right",
          });
        });
    } else if (stage === "validate-otp") {
      await axios
        .post(MobileAuthPath + "validate-otp", { mobile, otp: code })
        .then(async (result) => {
          if (result.status === 200) {
            await Swal.fire({
              icon: "success",
              title: "Logged In ✅",
              timer: 1500,
              position: "top-right",
            });
            setTimeout(() => {
              return (window.location = "/");
            }, 2000);
          }
        })
        .catch(async (error) => {
          console.log(error);
          return await Swal.fire({
            icon: "error",
            title: "Something happened!",
            text: error.response.data.errors.message,
            timer: 3000,
            position: "top-right",
          });
        });
    }
  }
  return (
    <AuthWrapper onSubmit={(e) => login(e)}>
      <h1>Login By Mobile</h1>
      <hr />
      <Input
        placeholder="Mobile number"
        type={"tel"}
        onChange={(e) => setMobile(e.target.value)}
        value={mobile}
      />
      {stage === "validate-otp" && (
        <Input
          placeholder="OTP code"
          type={"string"}
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
      )}

      <Button type="submit">Login</Button>

      <SubLink to={"/login-mobile"}>
        <h5>Login By Email</h5>
      </SubLink>
    </AuthWrapper>
  );
}

export default MobileLoginPage;
