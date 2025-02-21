import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Configure Cloudinary (Ensure environment variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const DELETE = async (
    req: Request,
    { params }: { params: { jobId: string; attachmentId: string } }
  ) => {
    try {
      const { userId } = await auth();
      const { jobId, attachmentId } = params;
  
      if (!userId) {
        return new NextResponse("Un-Authorized", { status: 401 });
      }
  
      if (!jobId) {
        return new NextResponse("ID Is missing", { status: 401 });
      }
  
      const attachment = await db.attachment.findUnique({
        where: {
          id: attachmentId,
        },
      });

   
    if (!attachment || attachment.jobId !== jobId) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Extract Cloudinary public ID from the URL
    const publicIdMatch = attachment.url.match(/\/v\d+\/([^/]+)\/([^/.]+)\./);
    if (!publicIdMatch) {
      return new NextResponse("Invalid Cloudinary URL", { status: 400 });
    }

    const publicId = `${publicIdMatch[1]}/${publicIdMatch[2]}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from the database
    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error(`[JOB_DELETE] :`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
