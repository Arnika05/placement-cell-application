"use client";

import { Company, Job } from "@prisma/client";
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Box from "@/components/box";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, BriefcaseBusiness, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

export const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const typeJob = job as Job & {
    company: Company | null;
  };
  const company = typeJob.company;
  const SavedUsersIcon = BookmarkCheck;
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showCourses, setShowCourses] = useState(false);

  return (
    <motion.div layout className="w-full">
      <Card className="p-5 shadow-md rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all">
        <div className="flex flex-row gap-6 items-center">
          {/* Left Section - Company Logo */}
          <div className="w-20 h-20 border rounded-md flex items-center justify-center overflow-hidden bg-gray-100">
            {company?.logo ? (
              <Image alt={company?.name} src={company?.logo} width={80} height={80} className="object-contain" />
            ) : (
              <BriefcaseBusiness className="w-8 h-8 text-gray-500" />
            )}
          </div>

          {/* Middle Section - Job Details */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800 truncate">{job.title}</p>
              <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
            </div>

            <Link href={`/company/${company?.id}`} className="text-sm text-blue-600 hover:underline truncate">
              {company?.name}
            </Link>

            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {job.employmentType && (
                <div className="flex items-center gap-1">
                  <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                  {job.employmentType}
                </div>
              )}

              {job.jobMode && (
                <div className="flex items-center gap-1">
                  <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                  {job.jobMode}
                </div>
              )}
            </div>

            {job.short_description && (
              <CardDescription className="text-sm mt-2">
                {truncate(job.short_description, { length: 100, omission: "..." })}
              </CardDescription>
            )}

            {/* Eligible Courses Section */}
            {job.eligibleCourses && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center px-3 py-1"
                  onClick={() => setShowCourses(!showCourses)}
                >
                  {showCourses ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showCourses ? "Hide Eligible Courses" : "View Eligible Courses"}
                </Button>

                {showCourses && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 p-2 rounded-md shadow-inner mt-2 max-w-md overflow-auto"
                  >
                    <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-x-4">
                      {job.eligibleCourses.map((course, index) => (
                        <li key={index} className="text-sm py-1">
                          {course.trim()}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col items-end gap-2">
            <Button variant="ghost" size="icon">
              {isBookmarkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SavedUsersIcon className="w-5 h-5 text-gray-700 hover:text-gray-900" />}
            </Button>

            <Link href={`/search/${job.id}`}>
              <Button className="border-blue-500 text-blue-500 hover:bg-blue-100 transition-all px-4 py-2 w-full">
                Details
              </Button>
            </Link>

            <Button className="text-white bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 w-full">
              Save
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
