import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Manually load .env.local for standalone execution
if (!process.env.MONGODB_URI) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const [key, ...value] = line.split("=");
      if (key && value) {
        process.env[key.trim()] = value.join("=").trim().replace(/^["']|["']$/g, "");
      }
    });
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in environment or .env.local");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Seeding EduFlow Egypt database...\n");

  await mongoose.connect(MONGODB_URI!);

  // Import models (forces discriminator registration)
  const User = (await import("../models/User")).default;
  const Person = (await import("../models/Person")).default;
  const Student = (await import("../models/Student")).default;
  const Driver = (await import("../models/Driver")).default;
  const AcademicYear = (await import("../models/AcademicYear")).default;
  const Term = (await import("../models/Term")).default;
  const GradeLevel = (await import("../models/GradeLevel")).default;
  const ClassGroup = (await import("../models/ClassGroup")).default;
  const Subject = (await import("../models/Subject")).default;
  const CurriculumItem = (await import("../models/CurriculumItem")).default;
  const Exam = (await import("../models/Exam")).default;
  const StudentExamResult = (await import("../models/StudentExamResult")).default;
  const Bus = (await import("../models/Bus")).default;
  const TransportRoute = (await import("../models/TransportRoute")).default;
  
  // Register discriminators explicitly
  await import("../models/Teacher");
  await import("../models/Staff");
  await import("../models/Guardian");

  // Clear existing data
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key]!.deleteMany({});
  }
  console.log("✅ Cleared existing data\n");

  // 1. Create admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await User.create({
    email: "admin@eduflow.eg",
    passwordHash,
    role: "admin",
    isActive: true,
    preferences: { locale: "ar", theme: "light" },
  });
  console.log("✅ Admin user created: admin@eduflow.eg / admin123");

  // 2. Academic Year
  const academicYear = await AcademicYear.create({
    nameAr: "العام الدراسي 2025-2026",
    nameEn: "Academic Year 2025-2026",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-06-30"),
    isActive: true,
    isCurrent: true,
  });
  console.log("✅ Academic year created");

  // 3. Terms
  const term1 = await Term.create({
    nameAr: "الفصل الدراسي الأول",
    nameEn: "First Term",
    academicYear: academicYear._id,
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-01-15"),
    sequence: 1,
    isActive: true,
  });

  await Term.create({
    nameAr: "الفصل الدراسي الثاني",
    nameEn: "Second Term",
    academicYear: academicYear._id,
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-06-30"),
    sequence: 2,
    isActive: true,
  });
  console.log("✅ Terms created");

  // 4. Grade Levels
  const grades = await GradeLevel.create([
    { nameAr: "KG1", nameEn: "KG1", code: "KG1", sequence: 1, stage: "kg" },
    { nameAr: "KG2", nameEn: "KG2", code: "KG2", sequence: 2, stage: "kg" },
    { nameAr: "الصف الأول", nameEn: "Grade 1", code: "G1", sequence: 3, stage: "primary" },
    { nameAr: "الصف الثاني", nameEn: "Grade 2", code: "G2", sequence: 4, stage: "primary" },
    { nameAr: "الصف الثالث", nameEn: "Grade 3", code: "G3", sequence: 5, stage: "primary" },
  ]);
  console.log("✅ Grade levels created");

  // 5. Class Groups
  const grade1 = grades.find((g) => g.code === "G1")!;
  const classG1A = await ClassGroup.create({
    nameAr: "1 - أ",
    nameEn: "1 - A",
    gradeLevel: grade1._id,
    academicYear: academicYear._id,
    capacity: 30,
    isActive: true,
  });
  console.log("✅ Class group created: 1-A");

  // 6. Subjects & Curriculum
  const subjectArabic = await Subject.create({
    nameAr: "اللغة العربية",
    nameEn: "Arabic Language",
    code: "AR-G1",
    gradeLevel: grade1._id,
    isCore: true,
  });

  const currArabic = await CurriculumItem.create({
    subject: subjectArabic._id,
    term: term1._id,
    title: "Arabic Grammar Basics",
    titleAr: "أساسيات قواعد اللغة العربية",
    sequence: 1,
  });
  console.log("✅ Subject and Curriculum created");

  // 7. Create sample persons
  const teacher1 = await Person.create({
    fullNameAr: "فاطمة علي محمد",
    fullNameEn: "Fatma Ali Mohamed",
    email: "fatma.ali@eduflow.eg",
    phoneWa: "+201221234567",
    gender: "female",
    role: "teacher",
    employeeId: "EMP-001",
  });

  await User.create({
    email: "fatma.ali@eduflow.eg",
    passwordHash,
    role: "teacher",
    person: teacher1._id,
    isActive: true,
    preferences: { locale: "ar", theme: "light" },
  });

  const student1 = await Student.create({
    fullNameAr: "يوسف أحمد محمد",
    fullNameEn: "Youssef Ahmed Mohamed",
    email: "youssef@eduflow.eg",
    phoneWa: "+201112345678",
    gender: "male",
    birthDate: new Date("2017-05-15"),
    role: "student",
    studentCode: "STU-2025-001",
    currentGradeLevel: grade1._id,
    classGroup: classG1A._id,
    enrollmentDate: new Date("2025-09-01"),
    status: "active",
  });
  console.log("✅ Teacher and Student created");

  // 8. Exams & Results
  const exam1 = await Exam.create({
    term: term1._id,
    nameAr: "اختبار الشهر الأول",
    nameEn: "First Monthly Quiz",
    examType: "quiz",
    subject: currArabic._id,
    examDate: new Date(),
    maxMarks: 20,
    weightPercentage: 10,
    isPublished: true,
    createdBy: teacher1._id,
  });

  await StudentExamResult.create({
    exam: exam1._id,
    student: student1._id,
    subject: currArabic._id,
    marksObtained: 18,
    isAbsent: false,
    gradedBy: teacher1._id,
    gradedAt: new Date(),
  });
  console.log("✅ Exam and Result created");

  // 9. Bus & Route
  const driver1 = await Driver.create({
    fullNameAr: "محمد عبد الله",
    fullNameEn: "Mohamed Abdullah",
    phoneWa: "+201551234567",
    gender: "male",
    role: "driver",
    licenseNumber: "LIC-123456",
    licenseExpiry: new Date("2027-12-31"),
  });

  const route1 = await TransportRoute.create({
    name: "Cairo – Maadi – School",
    branch: new mongoose.Types.ObjectId(),
    estimatedTimeMinutes: 30,
    feePerStudentPerMonth: 1000,
    active: true,
  });

  await Bus.create({
    plateNumber: "ق هـ د 4567",
    model: "Toyota Coaster",
    capacity: 32,
    driver: driver1._id,
    route: route1._id,
    isActive: true,
  });
  console.log("✅ Bus, driver, and route created");

  console.log("\n✨ Seeding complete!\n");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
