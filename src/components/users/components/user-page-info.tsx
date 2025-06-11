"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useSubscriberCount } from "@/hooks/use-subscribers";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useToggleSubscription } from "@/hooks/use-subscribers";
import { SubscriptionButton } from "@/components/video/components/subscription-button";

export const UserPageInfo = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSubscriberCount(userId);
  const { mutate: toggleSubscription } = useToggleSubscription(userId);

  const handleSubscription = () => {
    toggleSubscription(data?.isSubscribed || false, {
      onSuccess: () => {
        toast.success(
          data?.isSubscribed ? "You have unsubscribed" : "You have subscribed"
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoading) {
    return <UserPageInfoSkeleton />;
  }

  if (error || !data) {
    return <div>Error loading user info</div>;
  }

  return (
    <div className="py-6">
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            name={data.userName}
            className="h-[60px] w-[60px]"
            onClick={() => {}}
            imageUrl={"/avatar.jpg"}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{data.userName}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{data.count} subscribers</span>
              <span>&bull;</span>
              <span>{data.videoCount} videos</span>
            </div>
          </div>
        </div>
        {session?.user?.id === userId ? (
          <Button
            variant="secondary"
            asChild
            className="w-full mt-3 rounded-full"
          >
            <Link prefetch href="/studios">
              Go to studio
            </Link>
          </Button>
        ) : (
          <SubscriptionButton
            onClick={handleSubscription}
            disabled={isLoading}
            isSubscribed={data?.isSubscribed || false}
            className="flex-none"
          />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-start gap-4">
        <UserAvatar
          imageUrl={"/avatar.jpg"}
          size="xl"
          name={data.userName}
          className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
          onClick={() => {}}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{data.userName}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3 mb-3">
            <span>{data.count} subscribers</span>
            <span>&bull;</span>
            <span>{data.videoCount} videos</span>
          </div>
          {session?.user?.id === userId ? (
            <Button variant="secondary" asChild className="rounded-full">
              <Link prefetch href="/studios">
                Go to studio
              </Link>
            </Button>
          ) : (
            <SubscriptionButton
              onClick={handleSubscription}
              disabled={isLoading}
              isSubscribed={data?.isSubscribed || false}
              className="flex-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-full" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-start gap-4">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-32 mt-3 rounded-full" />
        </div>
      </div>
    </div>
  );
};
