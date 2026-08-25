import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
  "/ai-insights(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();
    const { pathname } = req.nextUrl;

    // auth pages redirect for authenticated users
    if (userId && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // protected routes
    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    return NextResponse.next();
  },
  { clockSkewInMs: 60000 }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};