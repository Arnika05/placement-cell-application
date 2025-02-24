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
import { truncate } from "lodash";
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
  const isSavedByUser = userId && job.savedUsers?.includes(userId)
  const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;
  const [showCourses, setShowCourses] = useState(false);
  const router = useRouter()

  const onClickSaveJob = async() => {
    try {
      setIsBookmarkLoading(true)
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`)
        toast.success("Job Removed")
      } else {
        await axios.patch(`/api/jobs/${job.id}/saveJobToCollection`)
        toast.success("Job Saved")
      }
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
      console.log(`Error : ${(error as Error)?.message}`)
    } finally{
      setIsBookmarkLoading(false)
    }
  }

  return (
    <motion.div layout className="w-full">
      <Card className="p-4 rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
        {/* Job Header Section */}
        <div className="flex items-center gap-3">
          {/* Company Logo */}
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-md bg-gray-50 border border-gray-200 shadow-sm">
            {company?.logo ? (
              <Image alt={company?.name} src={company?.logo} width={80} height={80} className="object-contain" />
            ) : (
              <BriefcaseBusiness className="w-8 h-8 text-gray-500" />
            )}
          </div>

          {/* Job Details */}
          <div className="flex flex-col flex-1">
            <p className="text-lg font-semibold text-gray-900">{job.title}</p>
            <Link href={`/company/${company?.id}`} className="text-sm text-blue-600 hover:underline font-medium">
              {company?.name}
            </Link>
            <p className="text-gray-500 text-xs">
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 transition-all"
            onClick={() => setIsBookmarkLoading(!isBookmarkLoading)}
          >            
          {isBookmarkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
          (<div onClick={onClickSaveJob}>
              <SavedUsersIcon
              className={cn("w-4 h-4", isSavedByUser ? "text-emerald-500" : "text-muted-foreground")} />
          </div>)}
          </Button>
        </div>

        {/* Job Information */}
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 text-gray-700 text-sm">
            {job.employmentType && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                {job.employmentType}
              </div>
            )}
            {job.jobMode && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                {job.jobMode}
              </div>
            )}
          </div>

          {job.short_description && (
            <CardDescription className="text-sm mt-1 text-gray-600">
              {/* {truncate(job.short_description, { length: 130, omission: "..." })} */}
              {job.short_description}
            </CardDescription>
          )}
        </div>

        {/* Eligible Courses Section */}
        {job.eligibleCourses && (
          <div className="mt-2 flex items-center justify-between">
            {/* View Courses Button (Now in a single line) */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 border-blue-400 hover:bg-blue-100 transition-all px-3 py-1 whitespace-nowrap"
              onClick={() => setShowCourses(!showCourses)}
            >
              {showCourses ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showCourses ? "Hide Courses" : "View Courses"}
            </Button>
          </div>
        )}

        {/* Course List */}
        {showCourses && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-100 p-2 rounded-md shadow-inner mt-2 border border-gray-200"
          >
            <ul className="list-disc list-inside text-gray-700 text-sm grid grid-cols-2 gap-x-3">
              {job.eligibleCourses.map((course, index) => (
                <li key={index} className="py-1">{course.trim()}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <Link href={`/search/${job.id ?? ""}`}>
            <Button className="border-blue-500 text-blue-500 hover:bg-blue-100 transition-all px-4 py-1.5 rounded-md text-sm">
              View Details
            </Button>
          </Link>

          <Button 
          className="text-white bg-blue-600 hover:bg-blue-700 transition-all px-4 py-1.5 rounded-md text-sm shadow-md"
          onClick={onClickSaveJob}>
            {isSavedByUser ? "Saved" : "Save for Later"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
