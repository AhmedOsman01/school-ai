import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import { requireRole, errorResponse, successResponse } from "@/lib/rbac";

/**
 * GET /api/students
 * 
 * Protected API route — only accessible by admin and teacher roles.
 * Returns paginated list of students.
 */
export async function GET(request: NextRequest) {
  // Role check
  const roleCheck = await requireRole("admin", "teacher");
  if (!roleCheck.authorized) {
    return errorResponse(roleCheck.error!, roleCheck.status);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const search = searchParams.get("search") || "";
    const gradeLevel = searchParams.get("gradeLevel");
    const classGroup = searchParams.get("classGroup");
    const academicYear = searchParams.get("academicYear");

    await connectDB();

    // Build query
    const query: Record<string, unknown> = { isActive: true };

    if (search) {
      query.$or = [
        { nameAr: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    if (gradeLevel) query.gradeLevel = gradeLevel;
    if (classGroup) query.classGroup = classGroup;
    if (academicYear) query.academicYear = academicYear;

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate("gradeLevel", "nameAr nameEn code")
        .populate("classGroup", "nameAr nameEn")
        .select("-__v")
        .sort({ studentId: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(query),
    ]);

    return successResponse({
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/students error:", error);
    return errorResponse("Internal server error", 500);
  }
}
