"use client";

import Box from '@/components/box';
import { CustomBreadCrumb } from '@/components/custom-bread-crumb';
import { ApplyModal } from '@/components/ui/apply-modal';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Attachment, Company, Job, Resumes, UserProfile } from '@prisma/client';
import axios from 'axios';
import { FileIcon, Briefcase, MapPin, DollarSign, Calendar, School } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface JobDetailsPageContentProps {
    job: Job & { company: Company | null; attachments: Attachment[]; eligibleCourses?: string[] };
    jobId: string;
    userProfile: (UserProfile & { resumes: Resumes[]; appliedJobs?: { jobId: string }[] }) | null;
}

export const JobDetailsPageContent = ({ job, jobId, userProfile }: JobDetailsPageContentProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const Router = useRouter();

    const onApplied = async () => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/user/${userProfile?.userId}/appliedJobs`, jobId);

            // Send mail to the user with job title and company name
            await axios.post(`/api/thankyou`, {
                fullName: userProfile?.fullName,
                email: userProfile?.email,
                jobTitle: job.title,
                companyName: job.company?.name
            });

            toast.success("Job Applied");

        } catch (error) {
            console.log((error as Error)?.message);
            toast.error("Something went wrong..");
        } finally {
            setOpen(false);
            setIsLoading(false);
            Router.refresh();
        }
    };

    return (
        <>

        <ApplyModal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        onConfirm={onApplied} 
        loading={isLoading} 
        userProfile={userProfile} />

        {userProfile && userProfile?.appliedJobs?.some(
            (appliedJob) => appliedJob.jobId === jobId
        ) && (
            <Banner
            variant={"success"}
            label={`Thank you for applying! Your application for ${job.title} at ${job.company?.name} has been received. We'll be in touch soon with an update.`} />
        )}

        <div className="max-w-4xl mx-auto space-y-8 p-8 bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-lg">
            
            {/* Breadcrumb */}
            <CustomBreadCrumb
                breadCrumbItem={[{ label: "Search", link: "/search" }]}
                breadCrumbPage={job?.title ?? ""}
            />

            {/* Job Title & Company */}
            <div className="space-y-4 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900">{job.title}</h2>

                <Link href={`/companies/${job.companyId}`} className="flex justify-center items-center gap-3 hover:opacity-80 transition">
                    {job?.company?.logo && (
                        <Image alt={job.company.name} width={50} height={50} className="rounded-full shadow-md" src={job.company.logo} />
                    )}
                    <p className="text-xl font-semibold text-gray-700">{job?.company?.name}</p>
                </Link>
            </div>

            {/* Job Description */}
            <p className="text-gray-700 text-lg text-center">{job.short_description ?? "No short description available."}</p>

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
                <p className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-5 h-5 text-blue-600" /> <strong>Employment Type:</strong> {job.employmentType ?? "Not specified"}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                    <School className="w-5 h-5 text-green-600" /> <strong>Job Mode:</strong> {job.jobMode ?? "Not specified"}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-red-600" /> <strong>Location:</strong> {job.location ?? "Not specified"}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5 text-yellow-600" /> <strong>Compensation:</strong> {job.compensation ?? "Not disclosed"}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-purple-600" /> <strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toDateString() : "Not specified"}
                </p>
            </div>

            {/* Eligible Courses */}
            {job.eligibleCourses && job.eligibleCourses.length > 0 && (
                <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-blue-700">Eligible Courses</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        {job.eligibleCourses.map((course, index) => (
                            <li key={index}>{course}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Attachments */}
            {job.attachments.length > 0 && (
                <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-800">Attachments</h3>
                    <p className="text-gray-600 mb-3">Download the attachment to know more about the job</p>
                    <ul className="list-none space-y-3">
                        {job.attachments.map(item => (
                            <li key={item.id} className="flex items-center gap-2 p-3 bg-white rounded-md shadow-sm hover:bg-gray-50 transition">
                                <FileIcon className="w-5 h-5 text-blue-500" />
                                <Link href={item.url} target="_blank" download className="text-blue-600 hover:underline">{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Apply Button */}
            <div className="flex justify-center">
                {userProfile ? (
                    !userProfile.appliedJobs?.some(appliedJob => appliedJob.jobId === jobId) ? (
                        <Button className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-md shadow-lg transition-transform transform hover:scale-105
                        " onClick={() => setOpen(true)}>
                            Apply Now
                        </Button>
                    ) : (
                        <Button className="text-lg px-6 py-2 border border-blue-500 text-blue-700 hover:bg-blue-700 hover:text-white rounded-md shadow-md transition">
                            Already Applied
                        </Button>
                    )
                ) : (
                    <Link href="/user">
                        <Button className="text-lg px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-md shadow-lg transition-transform transform hover:scale-105">
                            Update Profile
                        </Button>
                    </Link>
                )}
            </div>
        </div>
        </>
    );
};
