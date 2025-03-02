import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { SearchContainer } from "@/components/search-container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageContent from "../search/_components/page-content";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    employementType: string;
    jobMode: string;
    eligibleCourses: string[];
    savedJobs: boolean;
  };
}

const SavedJobsPage = async ({ searchParams }: SearchProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const jobs = await getJobs({ ...searchParams, savedJobs: true });

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Centered Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Breadcrumb */}
        <Box className="w-full bg-gray-200 text-gray-900 shadow-md rounded-lg p-4">
  <CustomBreadCrumb breadCrumbPage="Saved Jobs" />
</Box>


        {/* Heading with Blue Background */}
        <Box className="w-full bg-blue-600 text-white text-center shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold text-blue-800">Saved Jobs</h2>
        </Box>

        {/* Search Bar */}
        <div className="w-full bg-white shadow-md rounded-lg p-4">
          <SearchContainer />
        </div>

        {/* Job Listings */}
        <div className="w-full bg-white shadow-md rounded-lg p-6">
          <PageContent jobs={jobs} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default SavedJobsPage;
