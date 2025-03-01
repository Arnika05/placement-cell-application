
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { DataTable } from "@/components/ui/data-table";

const JobApplicantsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const filteredProfiles =
    profiles &&
    profiles.filter((profile) =>
      profile.appliedJobs.some((appliedJob) => appliedJob.jobId === params.jobId)
    );

  const formattedProfiles: ApplicantsColumns[] = filteredProfiles.map((profile) => ({
    id: profile.userId,
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    contact: profile.contact ?? "",
    appliedAt: profile.appliedJobs
      .find((job) => job.jobId === params.jobId)
      ?.appliedAt
      ? format(new Date(profile.appliedJobs.find((job) => job.jobId === params.jobId)?.appliedAt ?? ""), "MMMM do, yyyy")
      : "",
    resume: profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ?? "",
    resumeName: profile.resumes.find((res) => res.id === profile.activeResumeId)?.name ?? "",
  }));

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb Section */}
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          // breadCrumbItem={[
          //   { link: "/admin/jobs", label: "Jobs" },
          //   { link: "/admin/jobs", label: `${job ? job.title : ""}` },
          // ]}
        />
      </Box>

      {/* DataTable Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Applicants List</h2>
        <DataTable columns={columns} data={formattedProfiles} searchKey="fullName" />
      </div>
    </div>
  );
};

export default JobApplicantsPage;
