import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();
    // console.log(categories);

    return new NextResponse(JSON.stringify(categories, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
