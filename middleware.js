// import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/account(.*)",
//   "/transaction(.*)",
//   "/ai-insights(.*)",
// ]);

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/features(.*)",
//   "/about(.*)",
//   "/faq(.*)",
//   "/sso-callback(.*)",
//   "/api/webhooks(.*)",
// ]);

// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   rules: [
//     shield({
//       mode: "LIVE",
//     }),
//     detectBot({
//       mode: "LIVE",
//       allow: [
//         "CATEGORY:SEARCH_ENGINE",
//         "GO_HTTP",
//       ],
//     }),
//   ],
// });

// const clerk = clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   if (!userId && isProtectedRoute(req)) {
//     const { redirectToSignIn } = await auth();
//     return redirectToSignIn();
//   }

//   return NextResponse.next();
// });

// // ✅ Only ONE export
// export default createMiddleware(aj, clerk);

// // ✅ Only ONE config
// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };

import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
  "/ai-insights(.*)",
]);

// Arcjet config
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

// Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn(); // ✅ correct
  }

  return NextResponse.next();
});

// Chain middlewares
export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};