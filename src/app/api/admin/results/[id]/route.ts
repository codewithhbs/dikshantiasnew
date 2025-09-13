import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import ResultModel from "@/models/ResultModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// GET single result
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const result = await ResultModel.findById(id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE result (with optional image upload)
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const id = context.params.id;
    const name = formData.get("name")?.toString();
    const rank = formData.get("rank")?.toString();
    const service = formData.get("service")?.toString();
    const year = formData.get("year")?.toString();
    const desc = formData.get("desc")?.toString() || "";
    const btnName = formData.get("btnName")?.toString() || "";
    const btnLink = formData.get("btnLink")?.toString() || "";
    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ error: "Result ID is required" }, { status: 400 });
    }

    const existingResult = await ResultModel.findById(id);
    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    let updatedImage = existingResult.image;

    if (imageFile && imageFile.size > 0) {
      // Delete old image from S3
      if (existingResult.image?.key) {
        await deleteFromS3(existingResult.image.key);
      }

      // Upload new image to S3
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedImage = await uploadToS3(buffer, imageFile.name, imageFile.type, "results");

      updatedImage = {
        url: uploadedImage.url,
        key: uploadedImage.key,
      };
    }

    const updatedResult = await ResultModel.findByIdAndUpdate(
      id,
      { name, rank, service, year, desc, btnName, btnLink, image: updatedImage },
      { new: true }
    );

    return NextResponse.json(updatedResult, { status: 200 });
  } catch (error) {
    console.error("Error updating Result:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update Result" },
      { status: 500 }
    );
  }
}

// UPDATE Result active status
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const { active } = await request.json();
    const result = await ResultModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update active Result:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE result
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const result = await ResultModel.findById(id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Delete image from S3
    if (result.image?.key) {
      await deleteFromS3(result.image.key);
    }

    await ResultModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Failed to delete result:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
