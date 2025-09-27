import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { extractCandidateInfo, validateCandidateData } from "@/utils/textParser";

let pdfParse;
let mammoth;

async function parsePDF(filePath) {
  if (!pdfParse) {
    pdfParse = (await import("pdf-parse")).default;
  }
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function parseDOCX(filePath) {
  if (!mammoth) {
    mammoth = (await import("mammoth")).default;
  }
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function validateFile(file) {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = [".pdf", ".docx"];
  const ext = getFileExtension(file.name);

  if (!allowedTypes.includes(ext)) {
    return { isValid: false, error: "Only PDF and DOCX files are allowed" };
  }
  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 5MB" };
  }
  return { isValid: true };
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume"); // must match input name="resume"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Save file temporarily
    const uploadDir = process.env.NODE_ENV === "development" ? "./tmp" : "/tmp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, file.name);
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(bytes));

    // Parse content
    let extractedText = "";
    const ext = getFileExtension(file.name);
    if (ext === ".pdf") {
      extractedText = await parsePDF(filePath);
    } else if (ext === ".docx") {
      extractedText = await parseDOCX(filePath);
    }

    // Cleanup
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (!extractedText.trim()) {
      return NextResponse.json(
        { success: false, error: "No text content found in the file" },
        { status: 400 }
      );
    }

    // Extract + validate candidate info
    const candidateData = extractCandidateInfo(extractedText);
    const dataValidation = validateCandidateData(candidateData);

    return NextResponse.json({
      success: true,
      data: candidateData,
      validation: dataValidation,
      message: dataValidation.isValid
        ? "Resume parsed successfully"
        : "Resume parsed with warnings",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
