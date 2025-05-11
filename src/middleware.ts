export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/playlists/:path*",
    "/feed/:path*",
    "/studio",
  ],
};
