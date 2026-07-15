import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ urls: [] });
    }

    // Set target upload directory to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (file.size === 0) continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate a unique suffix for the filename
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const fileExtension = file.name.split(".").pop();
      const fileName = `${uniqueSuffix}.${fileExtension}`;
      
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Keep reference to static serving path
      urls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("🔴 Static File Upload Route Error:", err);
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
  }
}
