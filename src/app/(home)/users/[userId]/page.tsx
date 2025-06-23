import { UserView } from "@/components/users/views/user-view";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  return {
    title: `${user?.name} | YouTube Clone`,
  };
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  return <UserView userId={userId} />;
};

export default Page;
