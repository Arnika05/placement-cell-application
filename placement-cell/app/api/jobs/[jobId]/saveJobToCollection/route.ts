import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { jobId: string } }
) => {
    try {
        const { userId } = await auth();
        const { jobId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!jobId) {
            return new NextResponse("Id Is Missing", { status: 401 });
        }

        const job = await db.job.findUnique({
            where: {
                id: jobId,
                userId,
            }
        });

        if (!job) {
            return new NextResponse("Job Not Found", { status: 404 });
        }

        // Ensure savedUsers is an array
        const savedUsersArray = job.savedUsers ? job.savedUsers : [];

        const updatedJob = await db.job.update({
            where: {
                id: jobId,
                userId
            },
            data: {
                savedUsers: {
                    set: [...savedUsersArray, userId] // Properly update the array
                }
            }
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.log(`[JOB_UPDATE_PATCH] : ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
