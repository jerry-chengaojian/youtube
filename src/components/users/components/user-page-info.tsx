"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";

interface UserPageInfoProps {
  user: {
    id: string;
    name: string;
    imageUrl: string;
    subscriberCount: number;
    videoCount: number;
  };
}

export const UserPageInfo = () => {
  const mockUser = {
    id: "123",
    name: "Mock User",
    imageUrl: "",
    subscriberCount: 1000,
    videoCount: 50,
  };

  return (
    <div className="py-6">
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={mockUser.imageUrl}
            name={mockUser.name}
            className="h-[60px] w-[60px]"
            onClick={() => {}}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{mockUser.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{mockUser.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{mockUser.videoCount} videos</span>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          asChild
          className="w-full mt-3 rounded-full"
        >
          <Link prefetch href="/studio">
            Go to studio
          </Link>
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-start gap-4">
        <UserAvatar
          size="xl"
          imageUrl={mockUser.imageUrl}
          name={mockUser.name}
          className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
          onClick={() => {}}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{mockUser.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <span>{mockUser.subscriberCount} subscribers</span>
            <span>&bull;</span>
            <span>{mockUser.videoCount} videos</span>
          </div>
          <Button variant="secondary" asChild className="mt-3 rounded-full">
            <Link prefetch href="/studio">
              Go to studio
            </Link>
          </Button>
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
