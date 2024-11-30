import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/signin"]);
export default convexAuthNextjsMiddleware((request) => {
  console.log("Request Path:", request.nextUrl.pathname); // Debug log
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    console.log("Redirecting to /signin");
    return nextjsMiddlewareRedirect(request, "/signin");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
