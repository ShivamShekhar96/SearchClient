"use client";

import { getSession, signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      setAuthToken(session ? session["accessToken"] : "");
      setIsLoading(false);
    })();
  }, []);

  const logoutUser = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/logout`,
      {},
      {
        headers: {
          "x-auth-key": authToken,
        },
      }
    );
  };

  const onClick = async () => {
    if (authToken) {
      await logoutUser();
      await signOut({ callbackUrl: `${window.location.origin}/login` });
    } else {
      await signIn("google", {
        callbackUrl: `${window.location.origin}/search`,
      });
    }
  };
  return (
    <div
      title="Login"
      style={{
        position: 'absolute',
        top: 0,
        width: "10%",
        margin: 10,
        right: 0,
        alignItems: "flex-end",
      }}
    >
      <button
        style={{
          width: "100%",
          height: 40,
          background: "dodgerblue",
          borderRadius: 5,
        }}
        onClick={onClick}
      >
        {isLoading ? "...loading" : authToken ? "Log out" : "Log in"}
      </button>
    </div>
  );
};

export default Login;
