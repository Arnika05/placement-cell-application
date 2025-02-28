import { sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { email, fullName, jobTitle, companyName } = await req.json();

    const response = await sendMail({
        to: email,
        name: fullName,
        subject: "Thank you for applying",
        body: `Dear ${fullName},\n\nThank you for applying for the ${jobTitle} position at ${companyName}. We have received your application and will review it shortly.\n\nBest Regards from T&P Cell MANIT Bhopal.`
    });

    if (response?.messageId) {
        return NextResponse.json("Mail Delivered", { status: 200 });
    } else {
        return NextResponse.json("Mail not sent", { status: 401 });
    }
};
