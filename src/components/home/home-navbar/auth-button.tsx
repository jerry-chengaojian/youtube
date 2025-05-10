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

export const AuthButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <UserIcon className="size-4" />
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
