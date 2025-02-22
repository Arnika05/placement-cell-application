"use client";

import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";

export const SearchContainer = () => {
  const [value, setValue] = useState("");

  return (
    <div className="flex items-center gap-x-2 relative flex-1 justify-center">
      {/* Search Icon - Positioned Absolutely */}
      <Search className="h-4 w-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />

      {/* Input Field - Extra Left Padding to Avoid Overlapping */}
      <Input
        placeholder="Search for a job using title"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-10 pr-10 rounded-lg bg-blue-50/80 focus-visible:ring-blue-200 text-sm"
      />

      {/* Clear Button (X) - Positioned Absolutely on the Right */}
      {value && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setValue("")}
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 hover:scale-125 hover:bg-transparent"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
