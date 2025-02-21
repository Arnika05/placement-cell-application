import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns, JobsColumns } from "./_components/columns";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";

const JobPageOverview = async () => {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    // Fetch jobs
    const jobs = await db.job.findMany({
        where: { userId },
        include: { 
            category: true ,
            company: true
        },
        orderBy: { createdAt: "desc" },
    });

    // Format job data for the table
    const formattedJobs: JobsColumns[] = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company? job.company.name : "Unknown",
        category: job.category ? job.category.name : "N/A",
        isPublished: job.isPublished,
        createdAt: job.createdAt ? format(new Date(job.createdAt), "MMMM do, yyyy") : "N/A",
    }));

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Job Listings</h1>
                <Link href="/admin/create">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-md px-4 py-2 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span>New Job</span>
                    </Button>
                </Link>
            </div>

            {/* Job List Container */}
            <div className="bg-white shadow-md rounded-lg p-6">
                {formattedJobs.length > 0 ? (
                    <DataTable columns={columns} data={formattedJobs} searchKey="title" />
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-lg">No jobs found.</p>
                        <p className="text-sm">Create a new job listing to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPageOverview;
