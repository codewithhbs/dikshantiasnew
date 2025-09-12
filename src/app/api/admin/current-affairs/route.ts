import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import CurrentAffairs from "@/models/CurrentAffair";
import BlogCategoryModel from "@/models/BlogCategoryModel";
import SubCategoryModel from "@/models/SubCategoryModel";
import { uploadToS3 } from "@/lib/s3";

// ------------------ GET ALL ------------------
export async function GET() {
  try {
    await connectToDB();

    const currentAffairs = await CurrentAffairs.find()
      .populate({ path: "category", model: BlogCategoryModel })
      .populate({ path: "subCategory", model: SubCategoryModel });

    return NextResponse.json(currentAffairs);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch current affairs" },
      { status: 500 }
    );
  }
}

// ------------------ CREATE NEW ------------------
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const slug = formData.get("slug")?.toString();
    const shortContent = formData.get("shortContent")?.toString();
    const content = formData.get("content")?.toString();
    const categoryId = formData.get("category")?.toString();
    const subCategoryId = formData.get("subCategory")?.toString();
    const imageFile = formData.get("image") as File | null;
    const imageAlt = formData.get("imageAlt")?.toString() || "";
    const active = formData.get("active") === "true";

    const affairDate = formData.get("affairDate")?.toString();
    const parsedAffairDate = affairDate ? new Date(affairDate) : undefined;

    let uploadedImage = undefined;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      uploadedImage = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "current_affairs"
      );
    }

    const newAffair = await CurrentAffairs.create({
      title,
      slug,
      shortContent,
      content,
      category: categoryId,
      subCategory: subCategoryId || undefined,
      affairDate: parsedAffairDate,
      image: uploadedImage
        ? {
            key: uploadedImage.key,
            url: uploadedImage.url,
          }
        : undefined,
      imageAlt,
      active,
    });

    // Populate for response
    const populatedAffair = await newAffair.populate([
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
    ]);

    return NextResponse.json(populatedAffair, { status: 201 });
  } catch (err) {
    console.error("Error creating current affair:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create current affair" },
      { status: 500 }
    );
  }
}
