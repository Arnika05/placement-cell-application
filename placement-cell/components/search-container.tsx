"use client";

import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

export const SearchContainer = () => {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentCategroryId = searchParams.get("categoryId")
  const currentTitle = searchParams.get("title")
  const CreatedAtFilter = searchParams.get("createdAtFilter")
  const currentEmployementType = searchParams.get("employementType")
  const currentJobMode = searchParams.get("jobMode")
  const currentEligibleCourses = searchParams.get("eligibleCourses")

  const [value, setValue] = useState(currentTitle || "");

  const debounceValue = useDebounce(value)

  useEffect(() => {
    const url = qs.stringifyUrl({
      url : pathname,
      query : {
        title : debounceValue,
        categoryId : currentCategroryId,
        createdAtFilter : CreatedAtFilter,
        employementType : currentEmployementType,
        jobMode : currentJobMode,
        eligibleCourses : currentEligibleCourses,

      }
    },{
      skipNull: true,
      skipEmptyString : true,
    })
      router.push(url)
  }, [
    debounceValue,
    currentCategroryId,
    router,
    pathname,
    CreatedAtFilter,
    currentEmployementType,
    currentJobMode,
    currentEligibleCourses,
  ])
  

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
