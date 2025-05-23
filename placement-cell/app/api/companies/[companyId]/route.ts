import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = params;
    const updatedValues = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    const company = await db.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error(`COMPANY_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    const deletedCompany = await db.company.delete({
      where: {
        id: companyId,
        userId,
      },
    });

    return NextResponse.json(deletedCompany);
  } catch (error) {
    console.error(`COMPANY_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
