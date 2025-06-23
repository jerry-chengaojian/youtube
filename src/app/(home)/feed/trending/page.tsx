import { TrendingVideosSection } from "@/components/home/sections/trending-videos-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Videos",
  description: "View trending videos on YouTube",
};

const Page = async () => {
  return <TrendingVideosSection />;
};

export default Page;
