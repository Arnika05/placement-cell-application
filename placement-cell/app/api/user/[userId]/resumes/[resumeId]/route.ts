import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Configure Cloudinary (Ensure environment variables are set)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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
      console.error("Unauthorized request: No user ID found.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { resumeId } = params;
    if (!resumeId) {
      console.error("Missing resume ID in request.");
      return new NextResponse("Bad Request: Resume ID missing", { status: 400 });
    }

    const resume = await db.resumes.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      console.error(`Resume not found: ${resumeId}`);
      return new NextResponse("Resume not found", { status: 404 });
    }

    console.log("Resume found:", resume);

    // Extract Cloudinary public ID
    const cloudinaryUrl = resume.url;
    console.log("Cloudinary URL:", cloudinaryUrl);

    const urlParts = cloudinaryUrl.split("/");
    const versionIndex = urlParts.findIndex(part => part.startsWith("v"));

    if (versionIndex === -1) {
      console.error("Invalid Cloudinary URL format:", cloudinaryUrl);
      return new NextResponse("Invalid Cloudinary URL", { status: 400 });
    }

    // Extract public ID (remove file extension)
    const publicId = urlParts.slice(versionIndex + 1).join("/").replace(/\.\w+$/, "");
    console.log("Extracted Cloudinary Public ID:", publicId);

    // Delete from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary deletion response:", cloudinaryResponse);

    // Delete from database
    await db.resumes.delete({
      where: { id: resumeId },
    });

    console.log("Resume deleted successfully.");
    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(`[RESUME_DELETE ERROR]:`, error);
    return new NextResponse(`Internal Server Error: ${(error as Error).message}`, { status: 500 });
  }
};


