import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { ContactForm } from "./_components/contact-form";
import { ResumeForm } from "./_components/resume-form";
import { DateOfBirthForm } from "./_components/date-of-birth-form";
import { GenderForm } from "./_components/gender-from";
import { CategoryForm } from "./_components/category-from";
import { ScholarNumberForm } from "./_components/scholar-number-form";
import { EducationForm } from "./_components/education-form";
import { BacklogStatusForm } from "./_components/backlogs-form";
import { SocialLinksForm } from "./_components/social-links-form";
import { WorkExperienceForm } from "./_components/work-experience-form";
import { db } from "@/lib/db";
import { EmailForm } from "./_components/email-form";
import { FullNameForm } from "./_components/name-form";
import { DataTable } from "@/components/ui/data-table";
import { AppliedJobsColumns, columns } from "./_components/columns";
import { format } from "date-fns";

const ProfilePage = async () => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("sign-in");
    }

    let profile = await db.userProfile.findUnique({
        where: { userId },
        include: {
            resumes: { orderBy: { createdAt: "desc" } },
        },
    });

    const jobs = await db.job.findMany({
        where: {
            userId
        },
        include: {
            company: true,
            category: true,
        },
        
            orderBy: {
                createdAt: "desc"
            }
        
    })

    const filterAppliedJobs = profile && profile?.appliedJobs.length > 0 ? 
    jobs.filter((job) => profile.appliedJobs.some(
        (appliedJob) => appliedJob.jobId === job.id
    ))
    .map((job) => ({
        ...job,
        appliedAt: profile.appliedJobs.find(
            (appliedJob) => appliedJob.jobId === job.id
        )?.appliedAt
    })) : []

    const formattedJobs : AppliedJobsColumns[] = filterAppliedJobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company ? job.company.name : "",
        category: job.category? job.category.name : "",
        appliedAt: job.appliedAt ? format(new Date(job.appliedAt), "MMMM do, yyyy") : ""
    }))

    return (
        <div className="flex flex-col p-4 w-full items-center justify-center bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="max-w-5xl mb-6">
                <CustomBreadCrumb breadCrumbPage="My Profile" />
            </div>

            {/* Profile Box */}
            <Box className="flex flex-col items-center p-10 rounded-2xl shadow-2xl bg-white w-full max-w-5xl space-y-5 animate-fade-in">
                {/* Profile Details Sections */}
                <div className="w-full space-y-6">
                    {[
                        {
                            title: "Personal Information",
                            components: [
                                { label: "Full Name", Component: FullNameForm },
                                { label: "Date of Birth", Component: DateOfBirthForm },
                                { label: "Gender", Component: GenderForm },
                                { label: "Category", Component: CategoryForm },
                            ],layout: "grid grid-cols-2 md:grid-cols-2 gap-6",
                        },
                        {
                            title: "Contact Details",
                            components: [
                                { label: "Email", Component: EmailForm },
                                { label: "Phone Number", Component: ContactForm },
                            ],
                            layout: "grid grid-cols-2 md:grid-cols-2 gap-6",
                        },
                        {
                            title: "Academic Information",
                            components: [
                                { label: "Education Details", Component: EducationForm },
                                { label: "Scholar Number", Component: ScholarNumberForm },
                                { label: "Backlog Status", Component: BacklogStatusForm },
                            ],
                        },
                        {
                            title: "Work & Social",
                            components: [
                                { label: "Work Experience", Component: WorkExperienceForm },
                                { label: "Social Links", Component: SocialLinksForm },
                            ],
                            layout: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        },
                        {
                            title: "Resume Upload",
                            components: [
                                { label: "Resume", Component: ResumeForm },
                            ],
                        },
                    ].map((section, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-semibold text-blue-600 border-b-2 pb-2">
                                {section.title}
                            </h2>
                            <div className={`grid grid-cols-1 gap-6 mt-4 ${section.layout || ''}`}>
                                {section.components.map(({ label, Component }, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">{label}</h3>
                                        <Component initialData={profile} userId={userId} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Box>

            {/* applied jobs list table */}
            <Box className="flex flex-col p-8 items-center justify-start mt-10 rounded-2xl shadow-2xl bg-white w-full max-w-5xl space-y-5 animate-fade-in ">
            <div className="bg-gray-50 p-6 rounded-xl shadow-md w-full">
                <h2 className="text-2xl font-semibold text-blue-600 border-b-2 pb-2">
                    Applied Jobs
                </h2>
                <div className="w-full mt-6">
                    <DataTable columns={columns} searchKey="company" data={formattedJobs} />
                </div>
            </div>
            </Box>
        </div>
    );
};

export default ProfilePage;
