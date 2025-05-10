import { HomeView } from "@/components/home/views/home-view";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  return <HomeView categoryId={categoryId} />;
}
