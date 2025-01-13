import Github from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import {Password} from "@convex-dev/auth/providers/Password";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
import { ResendOTP } from "./ResendOTP";
export const { auth, signIn, signOut, store  } = convexAuth({
  providers: [Github, Google,Password({reset:ResendOTPPasswordReset}),ResendOTP],
});

