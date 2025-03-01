import { getJobs } from "@/actions/get-jobs";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CompanyDetailContentPage } from "./_components/company-detail-content";
import Box from "@/components/box";
 
const CompanyDetailPage = async ({ params }: { params: { companyId: string } }) => {
  const { userId } = await auth();

  // Fetch company details
  const company = await db.company.findUnique({
    where: { id: params.companyId },
  });

  if (!company || !userId) {
    redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
        companyId : params.companyId
    }, 
    include: {
        company: true,
    },
    orderBy: {
        createdAt: "desc"
    }
  })



  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Breadcrumbs */}
      <Box className="mb-6">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={company?.name || "Company Details"}
        />
      </Box>

      {/* Company Banner - Fixed Overflow Issue */}
      {/* {company?.coverImage && (
        <div className="w-full max-h-80 md:max-h-96 overflow-hidden rounded-lg shadow-lg">
          <Image
            alt={company.name}
            src={company.coverImage}
            width={900} // Ensure responsive scaling
            height={300}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      )} */}

      {/* Company Details Content */}
      <CompanyDetailContentPage jobs={jobs} company={company} userId={userId} />
    </div>
  );
};

export default CompanyDetailPage;
