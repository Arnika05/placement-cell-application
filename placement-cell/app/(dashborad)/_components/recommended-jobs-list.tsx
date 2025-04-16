"use client";

import Box from "@/components/box";
import { Job } from "@prisma/client";
import PageContent from "../(routes)/search/_components/page-content";

interface RecommendedJobsListProps {
  jobs: Job[];
  userId: string | null;
}

export const RecommendedJobsList = ({ jobs, userId }: RecommendedJobsListProps) => {
  return (
    <Box className="p-1 bg-white rounded-lg shadow-md border border-gray-200">

      <div className="grid gap-5">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      {/* <div className="flex justify-center mt-6">
        <Link href={"/search"}>
          <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
            View All Jobs
          </Button>
        </Link>
      </div> */}
    </Box>
  );
};
