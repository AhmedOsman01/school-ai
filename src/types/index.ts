// ============================================
// EduFlow Egypt - Core Type Definitions
// ============================================

import { Types } from "mongoose";

// ─── Common Enums ───────────────────────────

export const UserRoles = [
  "admin",
  "teacher",
  "student",
  "parent",
  "accountant",
  "driver",
  "staff",
] as const;
export type UserRole = (typeof UserRoles)[number];

export const PersonTypes = [
  "Student",
  "Teacher",
  "Guardian",
  "Driver",
  "Staff",
] as const;
export type PersonType = (typeof PersonTypes)[number];

export const Genders = ["male", "female"] as const;
export type Gender = (typeof Genders)[number];

export const AttendanceStatuses = [
  "present",
  "absent",
  "late",
  "excused",
] as const;
export type AttendanceStatus = (typeof AttendanceStatuses)[number];

export const BoardingStatuses = [
  "boarded",
  "absent",
  "late",
  "dropped_off",
] as const;
export type BoardingStatus = (typeof BoardingStatuses)[number];

export const InvoiceStatuses = [
  "draft",
  "issued",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
] as const;
export type InvoiceStatus = (typeof InvoiceStatuses)[number];

export const PaymentMethods = [
  "cash",
  "bank_transfer",
  "card",
  "cheque",
  "online",
  "wallet",
] as const;
export type PaymentMethod = (typeof PaymentMethods)[number];

export const FeeTypes = [
  "tuition",
  "registration",
  "transport",
  "cafeteria",
  "uniform",
  "books",
  "activity",
  "exam",
  "other",
] as const;
export type FeeType = (typeof FeeTypes)[number];

export const DiscountTypes = ["percentage", "fixed"] as const;
export type DiscountType = (typeof DiscountTypes)[number];

export const InstallmentStatuses = [
  "pending",
  "paid",
  "overdue",
  "partial",
] as const;
export type InstallmentStatus = (typeof InstallmentStatuses)[number];

export const ExamTypes = [
  "midterm",
  "final",
  "quiz",
  "practical",
  "oral",
] as const;
export type ExamType = (typeof ExamTypes)[number];

export const GradeLetters = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "F",
] as const;
export type GradeLetter = (typeof GradeLetters)[number];

export const DaysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
] as const;
export type DayOfWeek = (typeof DaysOfWeek)[number];

export const MealTypes = ["breakfast", "lunch", "snack"] as const;
export type MealType = (typeof MealTypes)[number];

export const OrderStatuses = [
  "pending",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof OrderStatuses)[number];

export const WalletTransactionTypes = ["credit", "debit"] as const;
export type WalletTransactionType = (typeof WalletTransactionTypes)[number];

export const AnnouncementPriorities = ["low", "normal", "high", "urgent"] as const;
export type AnnouncementPriority = (typeof AnnouncementPriorities)[number];

export const RelationshipTypes = [
  "father",
  "mother",
  "guardian",
  "sibling",
  "other",
] as const;
export type RelationshipType = (typeof RelationshipTypes)[number];

// ─── Document Interfaces ────────────────────

export interface IAddress {
  street?: string;
  city?: string;
  governorate?: string;
  postalCode?: string;
  country?: string;
}

export interface IPerson {
  _id: Types.ObjectId;
  fullNameAr: string;
  fullNameEn?: string;
  nationalId?: string;
  phoneWa: string;
  email?: string;
  gender?: "male" | "female";
  birthDate?: Date;
  address?: string;
  role: "student" | "teacher" | "parent" | "driver" | "staff" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudent extends IPerson {
  studentCode: string;
  enrollmentDate: Date;
  currentGradeLevel: Types.ObjectId;
  classGroup?: Types.ObjectId;
  guardians: Types.ObjectId[];
  transportAssignment?: Types.ObjectId;
  canteenWallet?: Types.ObjectId;
  status: "active" | "suspended" | "withdrawn" | "graduated";
  medicalNotes?: string;
  previousSchool?: string;
}

export interface ITeacher extends IPerson {
  personType: "Teacher";
  employeeId: string;
  subjects: Types.ObjectId[];
  qualifications: string[];
  specialization?: string;
  hireDate: Date;
  classGroups: Types.ObjectId[];
}

export interface IGuardian extends IPerson {
  personType: "Guardian";
  students: Types.ObjectId[];
  occupation?: string;
  workplace?: string;
  emergencyContact: boolean;
}

export interface IDriver extends IPerson {
  licenseNumber: string;
  licenseExpiry: Date;
  assignedBus?: Types.ObjectId;
}

export interface IStaff extends IPerson {
  personType: "Staff";
  employeeId: string;
  department: string;
  position: string;
  hireDate: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;
  person?: Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
  preferences: {
    locale: "ar" | "en";
    theme: "light" | "dark";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAcademicYear {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITerm {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  academicYear: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  sequence: number;
  isActive: boolean;
}

export interface IGradeLevel {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  code: string;
  sequence: number;
  stage: "kg" | "primary" | "preparatory" | "secondary";
  isActive: boolean;
}

export interface IClassGroup {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  gradeLevel: Types.ObjectId;
  academicYear: Types.ObjectId;
  capacity: number;
  homeRoomTeacher?: Types.ObjectId;
  room?: string;
  isActive: boolean;
}

export interface ISubject {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  code: string;
  gradeLevel: Types.ObjectId;
  department?: string;
  creditHours?: number;
  isCore: boolean;
  isActive: boolean;
}

export interface ICurriculumItem {
  _id: Types.ObjectId;
  subject: Types.ObjectId;
  term: Types.ObjectId;
  title: string;
  titleAr: string;
  description?: string;
  objectives: string[];
  resources: string[];
  weekNumber?: number;
  sequence: number;
}

export interface ITimetable {
  _id: Types.ObjectId;
  classGroup: Types.ObjectId;
  academicYear: Types.ObjectId;
  term: Types.ObjectId;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface IScheduleSlot {
  _id: Types.ObjectId;
  timetable: Types.ObjectId;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: Types.ObjectId;
  teacher: Types.ObjectId;
  room?: string;
}

export interface IAttendance {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  classGroup: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  markedBy: Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

export interface IAssignment {
  _id: Types.ObjectId;
  title: string;
  titleAr?: string;
  description?: string;
  subject: Types.ObjectId;
  classGroup: Types.ObjectId;
  teacher: Types.ObjectId;
  academicYear: Types.ObjectId;
  term: Types.ObjectId;
  dueDate: Date;
  maxPoints: number;
  attachments: string[];
  autoGradingHints?: {
    type: "keyword" | "exact" | "rubric";
    criteria: string[];
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmission {
  _id: Types.ObjectId;
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  content?: string;
  files: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  gradedBy?: Types.ObjectId;
  gradedAt?: Date;
  isLate: boolean;
}

export interface IExam {
  _id: Types.ObjectId;
  term: Types.ObjectId; // reference to Term
  nameAr: string; // e.g. "امتحان نصف الترم الأول"
  nameEn?: string;
  examType: "quiz" | "midterm" | "final" | "practical" | "oral" | "project";
  subject: Types.ObjectId; // CurriculumItem or Subject
  examDate: Date;
  maxMarks: number; // e.g. 30, 50, 100
  weightPercentage: number; // e.g. 30% of term total
  durationMinutes?: number;
  instructions?: string;
  isPublished: boolean;
  createdBy: Types.ObjectId; // Teacher who created it
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentExamResult {
  _id: Types.ObjectId;
  exam: Types.ObjectId;
  student: Types.ObjectId;
  subject: Types.ObjectId; // denormalized for faster queries
  marksObtained: number;
  isAbsent: boolean;
  isLateSubmission?: boolean;
  remarks?: string;
  gradedBy?: Types.ObjectId; // Teacher who entered/confirmed grade
  gradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentTermSubjectSummary {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  term: Types.ObjectId;
  subject: Types.ObjectId;
  totalMarksObtained: number; // sum of all weighted contributions
  totalMaxMarks: number; // sum of weighted max marks
  percentage: number; // calculated
  gradeLetter?: string; // A+, A, B+, ... (calculated)
  gpaPoint?: number; // 4.0 scale or custom
  remarks?: string;
  rankInClass?: number; // per subject or overall?
  lastCalculatedAt: Date;
}

export interface IStudentTermOverallSummary {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  term: Types.ObjectId;
  totalWeightedMarks: number;
  totalWeightedMax: number;
  overallPercentage: number;
  overallGPA: number;
  overallGrade: string;
  classRank: number;
  subjectsCount: number;
  passedSubjects: number;
  calculatedAt: Date;
}

// ─── Financial Interfaces ───────────────────

export interface IFeeStructure {
  _id: Types.ObjectId;
  gradeLevel: Types.ObjectId;
  academicYear: Types.ObjectId;
  term?: Types.ObjectId;
  feeType: FeeType;
  amount: number;
  currency: string;
  description?: string;
  descriptionAr?: string;
  isActive: boolean;
}

export interface IDiscount {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  type: DiscountType;
  value: number;
  criteria?: string;
  maxUses?: number;
  currentUses: number;
  validFrom?: Date;
  validTo?: Date;
  applicableFeeTypes: FeeType[];
  isActive: boolean;
}

export interface IInvoiceLineItem {
  feeType: FeeType;
  description: string;
  descriptionAr?: string;
  amount: number;
  discount?: Types.ObjectId;
  discountAmount: number;
  netAmount: number;
}

export interface IInvoice {
  _id: Types.ObjectId;
  invoiceNumber: string;
  student: Types.ObjectId;
  academicYear: Types.ObjectId;
  term?: Types.ObjectId;
  lineItems: IInvoiceLineItem[];
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: Date;
  issuedDate: Date;
  // ETA Egypt e-Invoicing fields
  etaUuid?: string;
  etaSubmissionId?: string;
  etaStatus?: string;
  etaQrCode?: string;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  _id: Types.ObjectId;
  paymentNumber: string;
  invoice: Types.ObjectId;
  student: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  receiptNumber?: string;
  date: Date;
  notes?: string;
  receivedBy: Types.ObjectId;
  createdAt: Date;
}

export interface IAllocation {
  _id: Types.ObjectId;
  payment: Types.ObjectId;
  invoice: Types.ObjectId;
  lineItemIndex: number;
  amount: number;
}

export interface IInstallment {
  _id: Types.ObjectId;
  invoice: Types.ObjectId;
  student: Types.ObjectId;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
  paidDate?: Date;
}

// ─── Transport Interfaces ───────────────────

export interface IGpsPoint {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface IBus {
  _id: Types.ObjectId;
  busNumber: string;
  plateNumber: string;
  capacity: number;
  busModel?: string;
  year?: number;
  driver?: Types.ObjectId;
  assistantName?: string;
  assistantPhone?: string;
  gpsDeviceId?: string;
  isActive: boolean;
}

export interface IRouteStop {
  name: string;
  nameAr: string;
  gpsPoint: IGpsPoint;
  estimatedTime: string;
  sequence: number;
}

export interface IRoute {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  bus: Types.ObjectId;
  direction: "to_school" | "from_school";
  stops: IRouteStop[];
  gpsPoints: IGpsPoint[];
  estimatedDurationMinutes: number;
  distanceKm?: number;
  isActive: boolean;
}

export interface IStudentTransportAssignment {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  bus: Types.ObjectId;
  route: Types.ObjectId;
  seatNumber?: number;
  pickupStop: string;
  dropoffStop: string;
  academicYear: Types.ObjectId;
  isActive: boolean;
}

export interface IBusAttendance {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  bus: Types.ObjectId;
  route: Types.ObjectId;
  date: Date;
  boardingStatus: BoardingStatus;
  boardingTime?: Date;
  dropoffTime?: Date;
  markedBy: Types.ObjectId;
  notes?: string;
}

// ─── Cafeteria Interfaces ───────────────────

export interface ICanteenItem {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  allergens?: string[];
  calories?: number;
  isActive: boolean;
}

export interface IMenu {
  _id: Types.ObjectId;
  date: Date;
  mealType: MealType;
  items: Types.ObjectId[];
  isActive: boolean;
}

export interface IStudentCanteenWallet {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  balance: number;
  dailyLimit?: number;
  lastTopUp?: Date;
  isActive: boolean;
}

export interface ICanteenOrderItem {
  item: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ICanteenOrder {
  _id: Types.ObjectId;
  orderNumber: string;
  student: Types.ObjectId;
  items: ICanteenOrderItem[];
  total: number;
  paymentMethod: "wallet" | "invoice" | "cash";
  status: OrderStatus;
  orderedBy: "student" | "parent" | "staff";
  orderedAt: Date;
  fulfilledAt?: Date;
}

export interface ICanteenTransaction {
  _id: Types.ObjectId;
  wallet: Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  reference?: string;
  description?: string;
  order?: Types.ObjectId;
  createdAt: Date;
}

// ─── Communication Interfaces ───────────────

export interface IAnnouncement {
  _id: Types.ObjectId;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  targetRoles: UserRole[];
  targetGrades?: Types.ObjectId[];
  targetClassGroups?: Types.ObjectId[];
  priority: AnnouncementPriority;
  author: Types.ObjectId;
  attachments: string[];
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Webhook / n8n Types ────────────────────

export interface IWebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface IAttendanceAlertPayload extends IWebhookPayload {
  event: "attendance.alert";
  data: {
    studentId: string;
    studentName: string;
    guardianPhone: string;
    status: AttendanceStatus;
    date: string;
    classGroup: string;
  };
}

export interface IInvoiceReminderPayload extends IWebhookPayload {
  event: "invoice.reminder";
  data: {
    studentId: string;
    studentName: string;
    guardianPhone: string;
    invoiceNumber: string;
    balanceDue: number;
    dueDate: string;
  };
}

export interface IExamResultPayload extends IWebhookPayload {
  event: "exam.result";
  data: {
    studentId: string;
    studentName: string;
    guardianPhone: string;
    examTitle: string;
    subject: string;
    marksObtained: number;
    maxMarks: number;
    grade: string;
  };
}

export interface IBusAbsencePayload extends IWebhookPayload {
  event: "bus.absence";
  data: {
    studentId: string;
    studentName: string;
    guardianPhone: string;
    busNumber: string;
    route: string;
    date: string;
  };
}

export interface ILowWalletPayload extends IWebhookPayload {
  event: "wallet.low_balance";
  data: {
    studentId: string;
    studentName: string;
    guardianPhone: string;
    currentBalance: number;
    threshold: number;
  };
}
