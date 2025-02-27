import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();
    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("Bad Request: No data provided", { status: 400 });
    }

    console.log("Authenticated user ID:", userId);
    console.log("Received values:", values);

    // Ensure dateOfBirth is stored as Date object
    if (values.dateOfBirth) {
      values.dateOfBirth = new Date(values.dateOfBirth);
    }

    let profile = await db.userProfile.findUnique({
      where: { userId },
      include: { resumes: { orderBy: { createdAt: "desc" } } },
    });

    let userProfile;
    if (profile) {
      userProfile = await db.userProfile.update({
        where: { userId },
        data: { ...values },
      });
    } else {
      userProfile = await db.userProfile.create({
        data: { userId, ...values },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("JOB_PATCH Error:", error);
    return new NextResponse("Internal Server Error: ", { status: 500 });
  }
};
