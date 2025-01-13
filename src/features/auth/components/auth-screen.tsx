"use client";

import { useState } from "react";
import { SignInFlow } from "@/features/auth/types";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { ResetPassword } from "@/features/auth/components/reset-password";
export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#ABC7FF]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" && <SignInCard setState={setState} />}
        {state === "signUp" && <SignUpCard setState={setState} />}
        {state === "resetPassword" && <ResetPassword  setState={setState}/>}
      </div>
    </div>
  );
};
