"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  useSubscriptions,
  useToggleSubscription,
} from "@/hooks/use-subscribers";
import {
  SubscriptionItem,
  SubscriptionItemSkeleton,
} from "../components/subscription-item";

const SubscriptionsSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
};

export const SubscriptionsSection = () => {
  const { data: subscriptions, isLoading, error } = useSubscriptions();
  if (isLoading) return <SubscriptionsSectionSkeleton />;
  if (error) return <p>Error loading subscriptions</p>;

  return (
    <div className="flex flex-col gap-4">
      {subscriptions?.map((subscription) => (
        <Link
          prefetch
          key={subscription.creatorId}
          href={`/users/${subscription.creator.id}`}
        >
          <SubscriptionItem
            name={subscription.creator.name}
            imageUrl={subscription.creator.avatarUrl || "/avatar.svg"}
            subscriberCount={subscription.creator.subscriberCount}
            onUnsubscribe={() => {}}
            disabled={false}
          />
        </Link>
      ))}
    </div>
  );
};
