import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import cloudinary from "@/lib/cloudinary";

// GET blog by ID
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}


// Helper to upload image buffer to Cloudinary
async function uploadImageToCloudinary(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "courses" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

//UPDATE course by ID
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    await connectToDB();
    const { id } = context.params;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const rawSlug = formData.get("slug") as string | null;
    const slug =
      rawSlug && rawSlug.trim().length > 0
        ? rawSlug
        : slugify(title, { lower: true, strict: true });

    const shortContent = formData.get("shortContent") as string;
    const content = formData.get("content") as string;
    const active = formData.get("active")
      ? JSON.parse(formData.get("active") as string)
      : true;
    const courseMode = formData.get("courseMode") as "online" | "offline";
    const lectures = parseInt(formData.get("lectures") as string, 10);
    const duration = formData.get("duration") as string;
    const languages = formData.get("languages") as string;
    const displayOrder = formData.get("displayOrder")
      ? parseInt(formData.get("displayOrder") as string, 10)
      : 0;
    const originalPrice = formData.get("originalPrice")
      ? parseFloat(formData.get("originalPrice") as string)
      : undefined;
    const price = formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : undefined;
    const totalFee = formData.get("totalFee")
      ? parseFloat(formData.get("totalFee") as string)
      : undefined;
    const oneTimeFee = formData.get("oneTimeFee")
      ? parseFloat(formData.get("oneTimeFee") as string)
      : undefined;
    const firstInstallment = formData.get("firstInstallment")
      ? parseFloat(formData.get("firstInstallment") as string)
      : undefined;
    const secondInstallment = formData.get("secondInstallment")
      ? parseFloat(formData.get("secondInstallment") as string)
      : undefined;
    const thirdInstallment = formData.get("thirdInstallment")
      ? parseFloat(formData.get("thirdInstallment") as string)
      : undefined;
    const fourthInstallment = formData.get("fourthInstallment")
      ? parseFloat(formData.get("fourthInstallment") as string)
      : undefined;

      const badge = (formData.get("badge") as string) || undefined;
      const badgeColor = (formData.get("badgeColor") as string) || undefined;
      const features = formData.get("features")
        ? JSON.parse(formData.get("features") as string)
        : undefined;


    let imageData: ICourse["image"] | undefined;
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const uploadedImage = await uploadImageToCloudinary(imageFile);
      imageData = {
        url: uploadedImage.secure_url,
        public_url: uploadedImage.url,
        public_id: uploadedImage.public_id,
        alt: (formData.get("imageAlt") as string) || "",
      };
    }
    const demoVideo = formData.get("demoVideo") as string | undefined;
    const videos = formData.get("videos")
      ? JSON.parse(formData.get("videos") as string)
      : [];
    const metaTitle = (formData.get("metaTitle") as string) || "";
    const metaDescription = (formData.get("metaDescription") as string) || "";
    const metaKeywords = formData.get("metaKeywords")
      ? JSON.parse(formData.get("metaKeywords") as string)
      : [];
    const canonicalUrl = (formData.get("canonicalUrl") as string) || "";
    const ogTitle = (formData.get("ogTitle") as string) || "";
    const ogDescription = (formData.get("ogDescription") as string) || "";
    const index = formData.get("index")
      ? JSON.parse(formData.get("index") as string)
      : true;
    const follow = formData.get("follow")
      ? JSON.parse(formData.get("follow") as string)
      : true;

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        shortContent,
        content,
        active,
        courseMode,
        lectures,
        duration,
        languages,
        displayOrder,
        originalPrice,
        price,
        totalFee,
        oneTimeFee,
        firstInstallment,
        secondInstallment,
        thirdInstallment,
        fourthInstallment,
        ...(imageData && { image: imageData }),
        demoVideo,
        videos,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        index,
        follow,
          ...(badge && { badge }),
          ...(badgeColor && { badgeColor }),
          ...(features && { features }),
      },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update course";
    console.error("Error updating course:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}




// UPDATE Cousre active status only
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const params = await context.params;
    const id = params.id;

    await connectToDB();

    const { active } = await request.json();

    const course = await Course.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: "course not found" }, { status: 404 });
    }

    // ✅ wrap course in object so frontend can use `data.course.active`
    return NextResponse.json({ course });
  } catch (error: any) {
    console.error("Failed to update active status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





// DELETE Course by ID
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = context.params;
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(course.image.public_id);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }
    await Course.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Course and associated image deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete course",
      },
      { status: 500 }
    );
  }
}
