import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import BlogsModel from "@/models/BlogsModel";
import "@/models/BlogCategoryModel";
import cloudinary from "@/lib/cloudinary"; 

// ✅ GET blog  by ID
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();

    const { id } = context.params;
    const blogs = await BlogsModel.findById(id).populate("category", "name");

    if (!blogs) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blogs, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}


// ✅ UPDATE blog
export async function PUT(req: Request, context: RouteContext<{ id: string }>) {
  try {
    await connectToDB();

    const formData = await req.formData();

    // Extract fields
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const shortContent = formData.get("shortContent") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const postedBy = formData.get("postedBy") as string;
    const active = JSON.parse(formData.get("active") as string);
    const tags = JSON.parse(formData.get("tags") as string);

    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const metaKeywords = JSON.parse(formData.get("metaKeywords") as string);
    const canonicalUrl = formData.get("canonicalUrl") as string;
    const ogTitle = formData.get("ogTitle") as string;
    const ogDescription = formData.get("ogDescription") as string;
    const index = JSON.parse(formData.get("index") as string);
    const follow = JSON.parse(formData.get("follow") as string);

    // Handle image upload
    let imageData = undefined;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageData = {
        url: uploadRes.secure_url,
        public_url: uploadRes.url,
        public_id: uploadRes.public_id,
        alt: formData.get("imageAlt") as string,
      };
    }

    // ✅ Build update object dynamically (avoid overwriting with null)
    const updateData = {
      title,
      slug,
      shortContent,
      content,
      category,
      postedBy,
      active,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      index,
      follow,
    };

    if (imageData) {
      updateData.image = imageData;
    }

    // ✅ Update blog
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      context.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog updated successfully", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update Blog" },
      { status: 500 }
    );
  }
}

// ✅ DELETE blog
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();

    const deletedBlog = await BlogsModel.findByIdAndDelete(context.params.id);

    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete Blog",
      },
      { status: 500 }
    );
  }
}
