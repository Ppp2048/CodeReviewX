import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/settings"];
const authPrefixes = ["/login", "/signup"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });

  return to;
}

export async function middleware(request: NextRequest) {
  const { response, user, hasEnv } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!hasEnv) {
    return response;
  }

  if (protectedPrefixes.some((prefix) => matchesPrefix(pathname, prefix)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "Please log in to access the dashboard.");

    return copyCookies(response, NextResponse.redirect(url));
  }

  if (authPrefixes.some((prefix) => matchesPrefix(pathname, prefix)) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";

    return copyCookies(response, NextResponse.redirect(url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login", "/signup"],
};
