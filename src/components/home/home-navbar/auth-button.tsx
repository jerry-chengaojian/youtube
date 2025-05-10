"use client";

import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AuthButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full p-0 hover:bg-transparent"
            >
              <Avatar className="size-10 border-2 border-white">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-gray-300 text-gray-700 text-lg">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <UserIcon className="mr-2 size-4" />
              <span>My profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ClapperboardIcon className="mr-2 size-4" />
              <span>Studio</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
          onClick={() => signIn()}
        >
          <UserCircleIcon />
          Sign in
        </Button>
      )}
    </>
  );
};
