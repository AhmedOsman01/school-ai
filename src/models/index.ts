// ============================================
// EduFlow Egypt - Model Registry
// ============================================
// Import all models to ensure discriminators are registered

export { default as Person } from "./Person";
export { default as Student } from "./Student";
export { default as Teacher } from "./Teacher";
export { default as Guardian } from "./Guardian";
export { default as Driver } from "./Driver";
export { default as Staff } from "./Staff";
export { default as User } from "./User";

// Academic
export { default as AcademicYear } from "./AcademicYear";
export { default as Term } from "./Term";
export { default as GradeLevel } from "./GradeLevel";
export { default as ClassGroup } from "./ClassGroup";
export { default as Subject } from "./Subject";
export { default as CurriculumItem } from "./CurriculumItem";

// Scheduling
export { default as Timetable } from "./Timetable";
export { default as ScheduleSlot } from "./ScheduleSlot";

// Assessment
export { default as Attendance } from "./Attendance";
export { default as Assignment } from "./Assignment";
export { default as Submission } from "./Submission";
export { default as Exam } from "./Exam";
export { default as StudentExamResult } from "./StudentExamResult";
export { default as StudentTermSubjectSummary } from "./StudentTermSubjectSummary";
export { default as StudentTermOverallSummary } from "./StudentTermOverallSummary";

// Financial
export { default as FeeStructure } from "./FeeStructure";
export { default as Discount } from "./Discount";
export { default as Invoice } from "./Invoice";
export { default as Payment } from "./Payment";
export { default as Allocation } from "./Allocation";
export { default as Installment } from "./Installment";

// Transportation
export { default as Bus } from "./Bus";
export { default as TransportRoute } from "./TransportRoute";
export { default as StudentTransportAssignment } from "./StudentTransportAssignment";
export { default as BusAttendance } from "./BusAttendance";

// Cafeteria
export { default as CanteenItem } from "./CanteenItem";
export { default as Menu } from "./Menu";
export { default as StudentCanteenWallet } from "./StudentCanteenWallet";
export { default as CanteenOrder } from "./CanteenOrder";
export { default as CanteenTransaction } from "./CanteenTransaction";
export { default as DailyMenu } from "./DailyMenu";

// Communication
export { default as Announcement } from "./Announcement";
