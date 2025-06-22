"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useSubscriptions } from "@/hooks/use-subscribers";

export const LoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

export const SubscriptionsSection = () => {
  const pathname = usePathname();
  const { data, isLoading, error } = useSubscriptions();

  if (error) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="text-sm text-red-500 p-2">
            Failed to load subscriptions
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <LoadingSkeleton />}
          {!isLoading &&
            data?.map((subscription) => (
              <SidebarMenuItem
                key={`${subscription.creatorId}-${subscription.viewerId}`}
              >
                <SidebarMenuButton
                  tooltip={subscription.creator.name}
                  asChild
                  isActive={pathname === `/users/${subscription.creatorId}`}
                >
                  <Link
                    prefetch
                    href={`/users/${subscription.creatorId}`}
                    className="flex items-center gap-4"
                  >
                    <UserAvatar
                      size="xs"
                      imageUrl={subscription.creator.avatarUrl || "/avatar.svg"}
                      name={subscription.creator.name}
                    />
                    <span className="text-sm">{subscription.creator.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
