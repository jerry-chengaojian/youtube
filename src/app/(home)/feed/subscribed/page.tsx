import { SubscribedVideosSection } from "@/components/home/sections/subscribed-videos-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribed Videos",
  description: "View videos from channels you're subscribed to",
};

const Page = async () => {
  return <SubscribedVideosSection />;
};

export default Page;
