import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ResultModel from "@/models/ResultModel";
import { uploadToS3 } from "@/lib/s3";


// GET all Results
export async function GET() {
  try {
    await connectToDB();
    const Results = await ResultModel.find();
    return NextResponse.json(Results);
  } catch (error) {
    console.error("Error fetching Results:", error);
    return NextResponse.json({ error: "Failed to fetch Results" }, { status: 500 });
  }
}


// Create new Result
export async function POST(req: Request) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const rank = formData.get("rank")?.toString();
    const service = formData.get("service")?.toString();
    const year = formData.get("year")?.toString();
    const desc = formData.get("desc")?.toString() || "";
    const btnName = formData.get("btnName")?.toString() || "";
    const btnLink = formData.get("btnLink")?.toString() || "";
    const active = formData.get("active") === "true";

    const imageFile = formData.get("image") as File | null;
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const { url, key } = await uploadToS3(buffer, imageFile.name, imageFile.type, "results");
    const newResult = await ResultModel.create({
      name,
      rank,
      service,
      year,
      desc,
      btnName,
      btnLink,
      active,
      image: { url, key },
    });

    return NextResponse.json(newResult, { status: 201 });
  } catch (err) {
    console.error("Error creating Result:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to create Result" },
      { status: 500 }
    );
  }
}
