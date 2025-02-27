import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const DELETE = async (
  req: Request,
  { params }: { params: { resumeId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { resumeId } = params;
    const resume = await db.resumes.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    // Extract Cloudinary public_id correctly
    const cloudinaryUrl = resume.url;
    const urlParts = cloudinaryUrl.split("/");
    const versionIndex = urlParts.findIndex(part => part.startsWith("v"));
    if (versionIndex === -1) {
      return new NextResponse("Invalid Cloudinary URL", { status: 400 });
    }

    // Extract the full path including folders and remove file extension
    const publicId = urlParts.slice(versionIndex + 1).join("/").replace(/\.\w+$/, "");

    console.log("Extracted Public ID:", publicId);

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    await db.resumes.delete({
      where: { id: resumeId },
    });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(`[RESUME_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
