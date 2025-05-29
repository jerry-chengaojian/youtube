export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/playlists/:path*",
    "/feed/subscribed",
    "/studio",
  ],
};
