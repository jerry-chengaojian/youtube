import { HomeView } from "@/components/home/views/home-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Clone",
  description: "Watch and share your favorite videos",
  openGraph: {
    title: "YouTube Clone",
    description: "Watch and share your favorite videos",
    siteName: "YouTube Clone",
    locale: "en_US",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { categoryId, search } = await searchParams;
  return <HomeView categoryId={categoryId} search={search} />;
}
