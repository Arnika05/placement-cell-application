"use client";

import { Company, Job } from "@prisma/client";
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, BriefcaseBusiness, Loader2, Eye, EyeOff, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

export const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const typeJob = job as Job & { company: Company | null };
  const company = typeJob.company;
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const isSavedByUser = userId && job.savedUsers?.includes(userId);
  const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;
  const [showCourses, setShowCourses] = useState(false);
  const router = useRouter();

  const onClickSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`);
        toast.success("Job Removed");
      } else {
        await axios.patch(`/api/jobs/${job.id}/saveJobToCollection`);
        toast.success("Job Saved");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(`Error : ${(error as Error)?.message}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <motion.div layout className="w-full flex justify-center">
      <Card className="max-w-md w-full p-5 rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
        {/* Job Header Section */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Section: Logo + Job Details */}
          <div className="flex items-center gap-4 flex-1">
            {/* Company Logo */}
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-md bg-gray-50 border border-gray-200 shadow-sm">
              {company?.logo ? (
                <Image alt={company?.name} src={company?.logo} width={56} height={56} className="object-contain" />
              ) : (
                <BriefcaseBusiness className="w-8 h-8 text-gray-500" />
              )}
            </div>

            {/* Job Details */}
            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-900 leading-tight">{job.title}</p>
              <Link href={`/companies/${company?.id}`} className="text-md text-blue-600 hover:underline font-medium">
                {company?.name}
              </Link>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Right Section: Bookmark Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 transition-all"
            onClick={onClickSaveJob}
          >
            {isBookmarkLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SavedUsersIcon className={cn("w-15 h-15", isSavedByUser ? "text-emerald-500" : "text-muted-foreground")} />
            )}
          </Button>
        </div>

        {/* Job Information */}
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          {/* Employment Type & Job Mode */}
          {job.employmentType && (
            <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-md text-blue-600 text-md">
              <BriefcaseBusiness className="w-5 h-5 text-blue-500" />
              {job.employmentType}
            </div>
          )}
          {job.jobMode && (
            <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-md text-blue-600 text-md">
              <BriefcaseBusiness className="w-5 h-5 text-blue-500" />
              {job.jobMode}
            </div>
          )}

          {/* View Courses Button */}
          {job.eligibleCourses && (
  <>
    <Button
      variant="outline"
      size="sm"
      className="ml-auto flex items-center gap-1 text-blue-600 border-blue-400 hover:bg-blue-100 transition-all px-4 py-4"
      onClick={() => setShowCourses(!showCourses)}
    >
      {showCourses ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      {showCourses ? "Hide Courses" : "View Courses"}
    </Button>

    {/* Show courses when button is clicked */}
    {showCourses && (
      <ul className="mt-2 p-2 bg-gray-100 rounded-md">
        {Array.isArray(job.eligibleCourses) ? (
          job.eligibleCourses.map((course, index) => (
            <li key={index} className="text-gray-700 text-sm px-2 py-1 border-b last:border-b-0">
              {course}
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No eligible courses found</p>
        )}
      </ul>
    )}
  </>
)}

        </div>

        {/* Job Description */}
        {job.short_description && (
          <CardDescription className="text-sm mt-2 text-gray-600">
            {job.short_description}
          </CardDescription>
        )}

        {/* Buttons Section */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          {/* View Details Button */}
          <Link href={`/search/${job.id ?? ""}`} passHref>
            <Button className="border-blue-500 bg-blue-100 text-white-500 hover:bg-gray-200 text-gray-800 transition-all px-10 py-1 rounded-md text-sm">
              View Details
            </Button>
          </Link>

          {/* Save for Later Button */}
          <Button
            className={`px-10 py-1 rounded-md text-sm shadow-md transition-all ${
              isSavedByUser
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={onClickSaveJob}
          >
            {isSavedByUser ? "    Job Saved      " : "Save for Later"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
