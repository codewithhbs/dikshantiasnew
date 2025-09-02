import { NextResponse } from "next/server";
import type { RouteContext } from "next"; 
import { connectToDB } from "@/lib/mongodb";
import BlogsModel from "@/models/BlogsModel";

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
      { error: error instanceof Error ? error.message : "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE blog category
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const body = await request.json();

    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      context.params.id,
      body,
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update Blog" },
      { status: 500 }
    );
  }
}

// ✅ DELETE blog category
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

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete Blog" },
      { status: 500 }
    );
  }
}
