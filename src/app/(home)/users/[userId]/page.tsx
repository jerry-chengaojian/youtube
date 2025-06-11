import { UserView } from "@/components/users/views/user-view";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  return <UserView userId={userId} />;
};

export default Page;
