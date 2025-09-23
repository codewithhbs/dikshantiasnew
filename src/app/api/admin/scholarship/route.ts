import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Scholarship from "@/models/Scholarship";

export async function POST(req: Request) {
  try {
    const { name, phone, email, course, message } = await req.json();

    await connectToDB();

    const newScholarship = new Scholarship({
      name,
      phone,
      email,
      course,
      message,
    });

    await newScholarship.save();

    return NextResponse.json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error saving scholarship:", error);
    return NextResponse.json({ success: false, message: "Something went wrong!" }, { status: 500 });
  }
}




// GET all scholarships
export async function GET() {
  try {
    await connectToDB();
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });

    return NextResponse.json(scholarships);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return NextResponse.json({ error: "Failed to fetch Results" }, { status: 500 });
  }
}
