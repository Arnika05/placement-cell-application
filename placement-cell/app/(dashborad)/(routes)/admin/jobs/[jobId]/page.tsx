import { CategoryForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/category-form";
import JobPublishActions from "@/app/(dashborad)/_components/job-publish-actions";
import { TitleForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/title-form";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-batch";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageForm } from "./_components/image-form";
import { ShortDescriptionForm } from "./_components/short-description";
import { EmploymentTypeForm} from "./_components/employement-type-form";
import { CompensationForm } from "./_components/compensation-form";
import { JobModeForm } from "./_components/job-mode-form";
import { CoursesEligibleForm } from "./_components/eligible-courses";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
    const { jobId } = await params; // No need to await here since params is not a promise

    // Verify the MongoDB ID
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(jobId)) {
        return redirect("/admin/jobs");
    }

    const authSession = await auth(); // Correct usage of await with auth
    const userId = authSession?.userId;

    if (!userId) {
        return redirect("/");
    }

    const job = await db.job.findUnique({
        where: {
            id: jobId,
            userId
        }
    });

    const categories = await db.category.findMany({
        orderBy: { name: "asc"},
    })

    if (!job) {
        return redirect("/admin/jobs");
    }

    const requiredFields = [job.title, job.description, job.imageUrl, job.categoryId];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="p-6">
            <Link href="/admin/jobs">
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </div>
            </Link>

            {/* Title */}
            <div className="flex items-center justify-between my-4">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Job Setup</h1>
                    <span className="text-sm text-neutral-500">
                        Complete All Fields {completionText}
                    </span>
                </div>

                {/* Action Button */}
                <JobPublishActions
                    jobId={jobId} // Corrected prop passing syntax
                    isPublished={job.isPublished}
                    disabled={!isComplete}
                />
            </div>

            {/* warning before publishing the post */}
            <Banner 
                variant={"warning"}
                label="This job is unpublished. It will not be visible in the job list."
            />

            {/* container layout */}
            <div  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    {/* title */}
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl text-neutral-700">Customize your job</h2>
                    </div>

                    {/* title form */}
                    <TitleForm initialData={job} jobId ={job.id} />

                    {/* category form */}
                    <CategoryForm initialData={job} jobId ={job.id} options={categories.map((category) => ({
                        label: category.name,
                        value: category.id
                    }))} />

                    {/* cover image */}
                    <ImageForm initialData={job} jobId ={job.id} />

                    {/* short description */}
                    <ShortDescriptionForm initialData={job} jobId ={job.id} />

                     {/* shift timing form */}
                     <EmploymentTypeForm initialData={job} jobId ={job.id} />

                     {/* CTC Form */}
                     <CompensationForm initialData={job} jobId={jobId as string} />

                     {/* Eligible Course */}
                     <CoursesEligibleForm initialData={job} jobId ={job.id} />

                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
