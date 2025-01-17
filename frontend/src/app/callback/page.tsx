"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

import { CredentialResponse } from "@react-oauth/google";
import axios from "axios";

export default function SignIn() {
  const router = useRouter();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const response = await axios.post(
      `${backendUrl}/api/auth/google`,
      {
        token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);
    if (response.status === 200) {
      console.log("Login Success");
      localStorage.setItem("access_token", response.data.access_token);
      router.push("/");
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <>
      <div>
        hello
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </>
  );
}
