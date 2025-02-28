import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const jobId = await req.text()
    if (!jobId) return new NextResponse("Job id is missing", { status: 401 });

    let profile = await db.userProfile.findUnique({
      where: { userId },
    });

    if(!profile){
        return new NextResponse("User Profile Not Found", { status: 401})
    }

    const updatedProfile = await db.userProfile.update({
        where:{
            userId
        },
        data: {
            appliedJobs : {
                push: {jobId}
            }
        }
    })

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("JOB_APPLIED_JOBS_PATCH Error:", error);
    return new NextResponse("Internal Server Error: ", { status: 500 });
  }
};
