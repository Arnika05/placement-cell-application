import { sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { email, fullName } = await req.json();

        const response = await sendMail({
            to: email,
            name: fullName,
            subject: "Congratulations! You Have Been Shortlisted",
            body: `Dear ${fullName},\n\nCongratulations! You have been shortlisted for one of the positions you recently applied for. Please check the website for complete details regarding the next steps. We will get in touch with you soon with further updates.\n\nBest Regards,\nT&P Cell, MANIT Bhopal.`
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
