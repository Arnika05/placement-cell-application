import { CategoryForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/category-form";
import JobPublishActions from "@/app/(dashborad)/_components/job-publish-actions";
import { TitleForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/title-form";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-batch";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Building2, File, LayoutDashboard, ListCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageForm } from "./_components/image-form";
import { ShortDescriptionForm } from "./_components/short-description";
import { EmploymentTypeForm} from "./_components/employement-type-form";
import { CompensationForm } from "./_components/compensation-form";
import { JobModeForm } from "./_components/job-mode-form";
import { CoursesEligibleForm } from "./_components/eligible-courses";
import { TagsForm } from "./_components/tags-form";
import { DeadlineForm } from "./_components/deadline-form";
import { Progress } from "@/components/ui/progress"; // Add a progress bar component
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachments-form";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
    const { jobId } = params; // No need to await here since params is not a promise

    // Verify the MongoDB ID
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(jobId)) {
        return redirect("/admin/jobs");
    }

    const authSession = await auth();
    const userId = authSession?.userId;

    if (!userId) {
        return redirect("/");
    }

    const job = await db.job.findUnique({
        where: {
            id: jobId,
            userId,
        },
        include: {
            attachments: true, // 👈 Ensure attachments are fetched
        },
    });
    

    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
    });

    const companies = await db.company.findMany({
        where: {
            userId
        }, orderBy : {
            createdAt: "desc"
        }
    });

    const attachments= await db.attachment.findMany({
        orderBy: { name: "asc" },
    });

    if (!job) {
        return redirect("/admin/jobs");
    }

    const requiredFields = [job.title, job.description, job.imageUrl, job.categoryId, job.companyId];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const completionPercentage = (completedFields / totalFields) * 100;
    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Back Button */}
            <Link href="/admin/jobs">
                <div className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 transition">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Jobs</span>
                </div>
            </Link>

            {/* Header Section */}
            <div className="flex items-center justify-between mt-6 p-4 bg-white shadow-md rounded-lg">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-semibold text-gray-800">Job Setup</h1>
                    <span className="text-sm text-gray-500">
                        Complete All Fields {completionText}
                    </span>
                    <Progress value={completionPercentage} className="w-64 mt-2" />
                </div>

                {/* Action Button */}
                <JobPublishActions jobId={jobId} isPublished={job.isPublished} disabled={!isComplete} />
            </div>

            {/* Warning Banner */}
            {!job.isPublished && (
                <Banner
                    variant="warning"
                    label="This job is unpublished. It will not be visible in the job list."
                />
            )}

            {/* Form Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Left Section */}
                <div className="space-y-6">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl font-semibold text-gray-700">Customize your job</h2>
                        </div>

                        {/* Forms */}
                        <TitleForm initialData={job} jobId={job.id} />
                        <CategoryForm
                            initialData={job}
                            jobId={job.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                        <ImageForm initialData={job} jobId={job.id} />
                        <ShortDescriptionForm initialData={job} jobId={job.id} />
                        <EmploymentTypeForm initialData={job} jobId={job.id} />
                        <CompensationForm initialData={job} jobId={job.id} />
                        <DeadlineForm initialData={job} jobId={job.id} />
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-6">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl font-semibold text-gray-700">Job Requirements</h2>
                        </div>

                        <TagsForm initialData={job} jobId={job.id} />
                        <CoursesEligibleForm initialData={job} jobId={job.id} />
                        
                        {/* Company details */}
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={Building2} />
                            <h2 className="text-xl font-semibold text-gray-700">Company Details</h2>
                        </div>

                        <CompanyForm
                            initialData={job}
                            jobId={job.id}
                            options={companies.map((company) => ({
                                label: company.name,
                                value: company.id,
                            }))}
                        />
                    </div>

                    {/* Attachments */}
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex items-center gap-x-2 mb-4">
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
