// src/app/api/test/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Simulate Rutter's redirect to your login page
  const redirectUrl = new URL("/login", request.url);
  redirectUrl.searchParams.set(
    "redirect_uri",
    "https://link.rutterapi.com/ibf_redirect?challenge=test-challenge"
  );

  return NextResponse.redirect(redirectUrl);
}
