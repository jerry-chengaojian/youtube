import Link from "next/link";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserInfo } from "./user-info";
import { SubscriptionButton } from "./subscription-button";
import {
  useSubscriberCount,
  useToggleSubscription,
} from "@/hooks/use-subscribers";
import { toast } from "sonner";

interface VideoOwnerProps {
  user: User;
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: subscriberData, isLoading } = useSubscriberCount(user.id);
  const { mutate: toggleSubscription } = useToggleSubscription(user.id);

  const handleSubscription = () => {
    toggleSubscription(subscriberData?.isSubscribed || false, {
      onSuccess: () => {
        toast.success(
          subscriberData?.isSubscribed
            ? "You have unsubscribed"
            : "You have subscribed"
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={"/avatar.jpg"} name={user.name} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={user.name} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {subscriberData?.count || 0} subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === user.id ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link prefetch href={`/studios/${videoId}`}>
            Edit video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={handleSubscription}
          disabled={isLoading}
          isSubscribed={subscriberData?.isSubscribed || false}
          className="flex-none"
        />
      )}
    </div>
  );
};
