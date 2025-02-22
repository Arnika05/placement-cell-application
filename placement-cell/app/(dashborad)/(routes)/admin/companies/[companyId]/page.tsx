import { CategoryForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/category-form";
import JobPublishActions from "@/app/(dashborad)/_components/job-publish-actions";
import { TitleForm } from "@/app/(dashborad)/(routes)/admin/jobs/[jobId]/_components/title-form";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-batch";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, ListCheck, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanyLogoForm } from "./logo-form";
import { CompanySocialContactsForm } from "./social-contact-form";
import { CoverImageForm } from "./cover-image-form";
import { CompanyOverviewForm } from "./overview-form";
import { WhyJoinUsForm } from "./why-join-us-form";

const CompanyDetailsPage = async ({ params }: { params: { companyId: string } }) => {
    const { companyId } = await params; // No need to await here since params is not a promise

    // Verify the MongoDB ID
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(companyId)) {
        return redirect("/admin/companies");
    }

    const authSession = await auth();
    const userId = authSession?.userId;

    if (!userId) {
        return redirect("/");
    }

    const company = await db.company.findUnique({
        where: {
            id: companyId,
            userId,
        },
    });

    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
    });

    if (!company) {
        return redirect("/admin/companies");
    }

    const requiredFields = [
        company.name,
        company.description,
        company.coverImage,
        company.website,
        company.linkedIn,
        company.overview,
        company.whyJoinUs,
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Back Button */}
            <Link href="/admin/companies">
                <div className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 transition">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Companies</span>
                </div>
            </Link>
    
            {/* Header Section */}
            <div className="flex items-center justify-between mt-6 p-4 bg-white shadow-md rounded-lg">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-semibold text-gray-800">Company Setup</h1>
                </div>
            </div>
    
            {/* Form Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Left Section */}
                <div className="space-y-6">
                    {/* Customize your Company (Separated Card) */}
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl font-semibold text-gray-700">Customize your Company</h2>
                        </div>
                    </div>
    
                    {/* Name form */}
                    <CompanyName initialData={company} companyId={companyId} />
    
                    {/* Description form
                    <CompanyDescriptionForm initialData={company} companyId={companyId} /> */}
    
                    {/* Logo form */}
                    <CompanyLogoForm initialData={company} companyId={companyId} />
                </div>
    
                {/* Right Section */}
                <div className="space-y-6">
                    {/* Company Social Contacts (Separated Card) */}
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={Network} />
                            <h2 className="text-xl font-semibold text-gray-700">Company Social Contacts</h2>
                        </div>
                    </div>
    
                    {/* Social Contacts Form */}
                    <CompanySocialContactsForm initialData={company} companyId={companyId} />
    
                    {/* Cover Image Form */}
                    <CoverImageForm initialData={company} companyId={companyId} />
                </div>
            </div>

            <div className="col-span-2">
                <CompanyOverviewForm initialData={company} companyId={companyId} />

                <WhyJoinUsForm initialData={company} companyId={companyId} />
            </div>
        </div>
    );
    
    
};

export default CompanyDetailsPage;
