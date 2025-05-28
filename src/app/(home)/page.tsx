import { HomeView } from "@/components/home/views/home-view";

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
