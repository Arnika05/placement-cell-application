"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import Box from "@/components/box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const HomeSearchContainer = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || undefined,
      },
    });

    router.push(href);
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <Box className="flex items-center bg-white shadow-md rounded-lg p-4 w-full max-w-2xl border border-gray-300">
        {/* Search Input */}
        <Input
          placeholder="Search Jobs by Role or Company..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 text-gray-800 border-none focus:ring-0 focus:outline-none"
        />

        {/* Search Button */}
        <Button
          onClick={handleClick}
          disabled={!title}
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:bg-gray-400 flex items-center"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </Box>
    </div>
  );
};

export default HomeSearchContainer;
