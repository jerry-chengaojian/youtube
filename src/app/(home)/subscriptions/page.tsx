import { SubscriptionsView } from "@/components/subscriptions/views/subscriptions-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "View and manage all your subscriptions",
};

const Page = async () => {
  return <SubscriptionsView />;
};

export default Page;
