import { HistoryView } from "@/components/playlists/views/history-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
  description: "View videos you've watched",
};

const Page = async () => {
  return <HistoryView />;
};

export default Page;
