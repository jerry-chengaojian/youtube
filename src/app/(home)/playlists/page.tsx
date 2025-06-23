import { PlaylistsView } from "@/components/playlists/views/playlists-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playlists",
  description: "View and manage your playlists",
};

const Page = async () => {
  return <PlaylistsView />;
};

export default Page;
