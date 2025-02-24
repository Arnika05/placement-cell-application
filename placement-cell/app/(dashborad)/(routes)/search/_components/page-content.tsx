"use client";

import { Job } from "@prisma/client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOut } from "@/app/animations";
import { JobCardItem } from "./job-card-item";

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col">
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Image
            alt="Not Found"
            src="/img/404.avif"
            width={300}
            height={200}
            className="w-auto h-auto object-contain"
          />
        </div>
        <h2 className="text-4xl font-semibold text-muted-foreground">
          No Jobs Found
        </h2>
      </div>
    );
  }

  return (
    <div className="pt-6 px-4">
      <AnimatePresence>
        <motion.div
          {...fadeInOut}
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {jobs.map((job) => (
            <JobCardItem key={job.id} job={job} userId={userId} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageContent;
