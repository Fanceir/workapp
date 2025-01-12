import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);
export default convexAuthNextjsMiddleware((request) => {
  console.log("Request Path:", request.nextUrl.pathname); // Debug log
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    console.log("Redirecting to /auth");
    return nextjsMiddlewareRedirect(request, "/auth");
  }
  if(isPublicPage(request) && isAuthenticatedNextjs()) {
    console.log("Redirecting to /");
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
