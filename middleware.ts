import { i18nMiddleware } from "@/middlewres/i18n-middleware";
// import { stackMiddlewares } from "./middlewres/stackMiddlewares";

// export function middleware(request: NextRequest) {
//   return i18nRouter(request, i18nConfig);
// }

// const middlewares = [i18nMiddleware];

// export default stackMiddlewares(middlewares)

import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // beforeAuth(req) {
  //   return i18nMiddleware(req);
  // },
  publicRoutes: ["/api/webhook", "/"],
  ignoredRoutes: ["/((?!api|trpc))(_next.*|.+.[w]+$)", "/"],
  // afterAuth(auth, req, evt) {
  //   return i18nMiddleware(req)
  // },
  // debug:true
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};

// export const config = {
//   // Matcher ignoring `/_next/` and `/api/`
//   matcher: [
//     // "/((?!api|static|.*..*|_next).*)",
//     "/((?!.+\\.[\\w]+$|_next).*)",
//     "/",
//     "/(api|trpc)(.*)",
//   ],
// };
