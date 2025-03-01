import { sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { email, fullName } = await req.json();

        const response = await sendMail({
            to: email,
            name: fullName,
            subject: "Update on Your Job Application",
            body: `Dear ${fullName},\n\nThank you for applying for one of the positions through our portal. We appreciate the time and effort you invested in the application process.\n\nAfter careful consideration, we regret to inform you that we will not be moving forward with your application at this time. However, we truly value your interest and encourage you to explore future opportunities with us.\n\nFor more details, please check the website for updates on job openings and application status.\n\nWe wish you all the best in your job search and future endeavors.\n\nBest Regards,\nT&P Cell, MANIT Bhopal.`
        });

        if (response?.messageId) {
            return NextResponse.json({ message: "Mail Delivered" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Mail not sent" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error sending mail:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
