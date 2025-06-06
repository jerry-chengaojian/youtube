"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(value.trim())}`);
      return;
    }

    const url = new URL(window.location.href);

    if (value.trim()) {
      url.searchParams.set("search", value.trim());
    } else {
      url.searchParams.delete("search");
    }

    router.push(url.toString());
  };

  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <button
        disabled={!value.trim()}
        type="submit"
        className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
