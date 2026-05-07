import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
  "/ai-insights(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

const clerk = clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();
    const { pathname } = req.nextUrl;

    // ✅ sign-in page પર logged in હોય તો dashboard
    if (userId && pathname.startsWith("/sign-in")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ✅ Protected route — login જોઈએ
    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // ✅ બાકી બધું normal — home પર જઈ શકે
    return NextResponse.next();
  },
  { clockSkewInMs: 60000 }
);

export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};