import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { userId } = await auth();
        const { name } = await req.json();

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        if (!name) {
            return new NextResponse("Name is missing", { status: 400 });
        }

        const job = await db.company.create({
            data: {
                userId,
                name,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error(`COMPANY_POST: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
