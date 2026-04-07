import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Protected routes - આ routes માં login જોઈએ
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// ✅ Arcjet - Bot protection & Shield
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

// ✅ Clerk - Auth check
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // User logged in નથી + protected route છે → Sign-in redirect
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn(); // Login પછી same page પર પાછો આવે
  }

  return NextResponse.next();
});

// ✅ Arcjet + Clerk combine
export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|svg)).*)",
    "/(api|trpc)(.*)",
  ],
};