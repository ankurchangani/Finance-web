import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// ✅ Sign-in/up routes ને exclude કરો — infinite loop avoid
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/features(.*)",
  "/about(.*)",
  "/faq(.*)",
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

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // ✅ Public routes — સૌ access કરી શકે
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // ✅ NOT logged in + protected page → sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({
      returnBackUrl: req.nextUrl.pathname,
    });
  }

  return NextResponse.next();
});

export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|svg)).*)",
    "/(api|trpc)(.*)",
  ],
};