import { LikedVideosView } from "@/components/playlists/views/liked-videos-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liked Videos",
  description: "View videos you've liked",
};

const Page = async () => {
  return <LikedVideosView />;
};

export default Page;
