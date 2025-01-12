import { convexAuth } from "@convex-dev/auth/server";
import Github from "@auth/core/providers/github";
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Github],

});
