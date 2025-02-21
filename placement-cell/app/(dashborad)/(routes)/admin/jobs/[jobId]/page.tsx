import { CategoryForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/category-form";
import JobPublishActions from "@/app/(dashborad)/_components/job-publish-actions";
import { TitleForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/title-form";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-batch";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Building2, File, ListCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageForm } from "./_components/image-form";
import { ShortDescriptionForm } from "./_components/short-description";
import { EmploymentTypeForm } from "./_components/employement-type-form";
import { CompensationForm } from "./_components/compensation-form";
import { JobModeForm } from "./_components/job-mode-form";
import { CoursesEligibleForm } from "./_components/eligible-courses";
import { TagsForm } from "./_components/tags-form";
import { DeadlineForm } from "./_components/deadline-form";
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachments-form";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
    const { jobId } = await params;

    // Verify MongoDB Object ID Format
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(jobId)) {
        return redirect("/admin/jobs");
    }

    // Authentication Check
    const authSession = await auth();
    const userId = authSession?.userId;
    if (!userId) {
        return redirect("/");
    }

    // Fetch job specific to the user
    const job = await db.job.findUnique({
        where: {
            id: jobId,
            userId, // Ensures user-specific job access
        },
        include: {
            attachments: true,
        },
    });

    if (!job) {
        return redirect("/admin/jobs");
    }

    // Fetch categories and companies specific to the user
    const [categories, companies] = await Promise.all([
        db.category.findMany({ orderBy: { name: "asc" } }),
        db.company.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);

    // const requiredFields = [job.title, job.description, job.imageUrl, job.categoryId, job.companyId];
    // const isComplete = requiredFields.every(field => field && typeof field === "string" && field.trim() !== "");

    const requiredFields = [
      job.title, 
      job.categoryId, 
      job.imageUrl, 
      job.short_description, 
      job.employmentType, 
      job.compensation, 
      job.deadline,
      job.eligibleCourses?.length > 0, // Ensuring at least one eligible course is present
      job.companyId,
      job.jobMode, // Job mode is required
    ];
    
    // Check if all required fields are valid (not undefined, null, or empty)
    const isComplete = requiredFields.every(field => 
      Array.isArray(field) ? field.length > 0 : !!field
    );

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Back Button */}
            <Link href="/admin/jobs" className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 transition">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Jobs</span>
            </Link>

            {/* Header Section */}
            <div className="flex items-center justify-between mt-6 p-4 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800">Job Setup</h1>
                <JobPublishActions jobId={jobId} isPublished={job.isPublished} disabled={!isComplete} />
            </div>

            {/* Warning Banner */}
            {!job.isPublished && (
                <Banner variant="warning" label="This job is unpublished. It will not be visible in the job list." />
            )}

            {/* Main Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Left Section */}
                <div className="space-y-6">
                    <div className="p-6 bg-white shadow rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl font-semibold text-gray-700">Customize your job</h2>
                        </div>
                        {/* Forms */}
                        <TitleForm initialData={job} jobId={job.id} />
                        <CategoryForm jobId={job.id} initialData={job} options={categories.map(c => ({ label: c.name, value: c.id }))} />
                        <ImageForm initialData={job} jobId={job.id} />
                        <ShortDescriptionForm initialData={job} jobId={job.id} />
                        <EmploymentTypeForm initialData={job} jobId={job.id} />
                        <JobModeForm initialData={job} jobId={job.id}/>
                        <CompensationForm initialData={job} jobId={job.id} />
                        <DeadlineForm initialData={job} jobId={job.id} />
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-6">
                    {/* Job Requirements */}
                    <div className="p-6 bg-white shadow rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl font-semibold text-gray-700">Job Requirements</h2>
                        </div>
                        <TagsForm initialData={job} jobId={job.id} />
                        <CoursesEligibleForm initialData={job} jobId={job.id} />

                    </div>

                    <div className="p-6 bg-white shadow rounded-lg">
                      {/* Company Details */}
                      <div className="flex items-center gap-2 mb-4 mt-4">
                            <IconBadge icon={Building2} />
                            <h2 className="text-xl font-semibold text-gray-700">Company Details</h2>
                        </div>
                        <CompanyForm jobId={job.id} initialData={job} options={companies.map(c => ({ label: c.name, value: c.id }))} />
                    </div>

                    {/* Attachments Section */}
                    <div className="p-6 bg-white shadow rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <IconBadge icon={File} />
                            <h2 className="text-xl font-semibold text-gray-700">Attachments</h2>
                        </div>
                        <AttachmentsForm initialData={{ ...job, attachments: job.attachments ?? [] }} jobId={job.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
