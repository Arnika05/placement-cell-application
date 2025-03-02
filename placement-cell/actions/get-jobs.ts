import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    employmentType?: string;
    jobMode?: string;
    eligibleCourses?: string[];
    savedJobs?: boolean;
};

export const getJobs = async ({
    title,
    categoryId,
    createdAtFilter,
    employmentType,
    jobMode,
    eligibleCourses,
    savedJobs
}: GetJobs): Promise<Job[]> => {
    const { userId } = await auth();
    

    try {
        let query: any = {
            where: {
                isPublished: true,
            },
            include: {
                company: true,
                category: true,
                attachments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        };

        // Add filters to `AND` array
        const filters = [];

        if (title) {
            filters.push({
                title: {
                    contains: title,
                    mode: "insensitive",
                },
            });
        }

        if (categoryId) {
            filters.push({
                categoryId: {
                    equals: categoryId,
                },
            });
        }

        if (employmentType) {
            filters.push({
                employmentType: {
                    equals: employmentType,
                },
            });
        }

        if (jobMode) {
            filters.push({
                jobMode: {
                    equals: jobMode,
                },
            });
        }

        if (eligibleCourses && eligibleCourses.length > 0) {
            filters.push({
                eligibleCourses: {
                    hasSome: eligibleCourses ?? [], // ✅ Prevent null errors
                },
            });
        }
        

        if (createdAtFilter) {
            const currentDate = new Date();
            let startDate: Date;

            switch (createdAtFilter) {
                case "today":
                    startDate = new Date(currentDate);
                    break;

                case "yesterday":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - 1);
                    break;

                case "thisWeek":
                    startDate = new Date();
                    startDate.setDate(currentDate.getDate() - currentDate.getDay());
                    break;

                case "lastWeek":
                    startDate = new Date();
                    startDate.setDate(currentDate.getDate() - currentDate.getDay() - 7);
                    break;

                case "thisMonth":
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    break;

                default:
                    startDate = new Date(0);
            }

            filters.push({
                createdAt: {
                    gte: startDate,
                },
            });
        }

        // Apply filters
        if (filters.length > 0) {
            query.where.AND = filters;
        }

        if (savedJobs){
            query.where.savedUsers = {
                has: userId
            }
        }

        // Execute query
        const jobs = await db.job.findMany(query); // ✅ Added `await`
        return jobs;
    } catch (error) {
        console.log("[GET_JOBS]:", error);
        return [];
    }
};
