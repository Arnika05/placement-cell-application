import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const PATCH = async (req: Request, {params} : {params : {jobId : string}}) => {
  try {
      const { userId } = await auth();
      const {jobId } = await params
      const updatedValues = await req.json();

      if (!userId) return new NextResponse("Unauthorized", { status: 401 });
      if (!jobId) {
          return new NextResponse("Id is missing", { status: 400 });
      }

      const job = await db.job.update({
          where: {
              id: jobId,
              userId
          },
          data : {
              ...updatedValues
          }
      });

      return NextResponse.json(job);
  } catch (error) {
      console.error(`JOB_PAtch: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to extract Cloudinary Public ID from a URL
const getCloudinaryPublicId = (url: string | null) => {
  if (!url) return null; // Handle null URLs safely
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; // Get last part of URL (file name)
    return filename.split(".")[0]; // Remove file extension
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};

export const DELETE = async (req: Request, { params }: { params: { jobId: string } }) => {
  try {
    const authData = await auth();
    if (!authData?.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { userId } = authData;
    const { jobId } = params;

    if (!jobId) return new NextResponse("Job ID is missing", { status: 400 });

    // Fetch the job with attachments
    const job = await db.job.findUnique({
      where: { id: jobId, userId },
      include: { attachments: true },
    });

    if (!job) return new NextResponse("Job Not Found", { status: 404 });

    // Delete job image from Cloudinary
    const jobImageId = getCloudinaryPublicId(job.imageUrl);
    if (jobImageId) {
      try {
        await cloudinary.uploader.destroy(jobImageId);
      } catch (err) {
        console.error("Cloudinary Delete Error (Job Image):", err);
      }
    }

    // Delete all job attachments from Cloudinary
    if (job.attachments?.length) {
      await Promise.all(
        job.attachments.map(async (attachment) => {
          const attachmentId = getCloudinaryPublicId(attachment.url);
          if (attachmentId) {
            try {
              await cloudinary.uploader.destroy(attachmentId);
            } catch (err) {
              console.error("Cloudinary Delete Error (Attachment):", err);
            }
          }
        })
      );
    }

    // Delete job and attachments from database
    await db.$transaction([
      db.attachment.deleteMany({ where: { jobId } }), // Ensure correct field reference
      db.job.delete({ where: { id: jobId, userId } }), // Ensure `userId` is used
    ]);

    return new NextResponse("Job deleted successfully", { status: 200 });

  } catch (error) {
    console.error(`JOB_DELETE ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

