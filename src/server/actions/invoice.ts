"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import Invoice from "@/models/Invoice";
import FeeStructure from "@/models/FeeStructure";
import StudentTransportAssignment from "@/models/StudentTransportAssignment";
import StudentCanteenWallet from "@/models/StudentCanteenWallet";
import Student from "@/models/Student";
import Installment from "@/models/Installment";
import { auth } from "@/lib/auth";
import type { IInvoiceLineItem, FeeType } from "@/types";

// ─── Validation Schema ─────────────────────

const CreateInvoiceSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  termId: z.string().optional(),
  includeTransport: z.boolean().default(false),
  includeCafeteria: z.boolean().default(false),
  cafeteriaAmount: z.number().min(0).optional(),
  discountIds: z.array(z.string()).optional(),
  installmentCount: z.number().min(1).max(12).optional(),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

interface ActionResult {
  success: boolean;
  error?: string;
  data?: {
    invoiceId: string;
    invoiceNumber: string;
    total: number;
    installments?: number;
  };
}

// ─── Generate Invoice Number ────────────────

function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `INV-${year}${month}-${random}`;
}

// ─── Server Action ──────────────────────────

export async function createInvoiceWithTransportAndCanteen(
  input: CreateInvoiceInput
): Promise<ActionResult> {
  try {
    // 1. Authenticate & authorize
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!["admin", "accountant"].includes(session.user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // 2. Validate input
    const parsed = CreateInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
      };
    }

    const data = parsed.data;

    await connectDB();

    // 3. Verify student exists
    const student = await Student.findById(data.studentId);
    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // 4. Get fee structures for this grade/year
    const feeStructures = await FeeStructure.find({
      gradeLevel: student.gradeLevel,
      academicYear: data.academicYearId,
      ...(data.termId ? { term: data.termId } : {}),
      isActive: true,
    });

    if (feeStructures.length === 0) {
      return { success: false, error: "No fee structures found for this grade/year" };
    }

    // 5. Build line items
    const lineItems: IInvoiceLineItem[] = [];

    // Add standard fees (tuition, registration, etc.)
    for (const fee of feeStructures) {
      if (fee.feeType === "transport" && !data.includeTransport) continue;
      if (fee.feeType === "cafeteria" && !data.includeCafeteria) continue;

      lineItems.push({
        feeType: fee.feeType as FeeType,
        description: fee.description || fee.feeType,
        descriptionAr: fee.descriptionAr,
        amount: fee.amount,
        discountAmount: 0,
        netAmount: fee.amount,
      });
    }

    // 6. Add transport fee if applicable
    if (data.includeTransport) {
      const transportAssignment = await StudentTransportAssignment.findOne({
        student: data.studentId,
        academicYear: data.academicYearId,
        isActive: true,
      });

      if (transportAssignment) {
        // Check if a transport fee exists, if not add a line item
        const hasTransportFee = lineItems.some(
          (item) => item.feeType === "transport"
        );
        if (!hasTransportFee) {
          const transportFee = await FeeStructure.findOne({
            gradeLevel: student.gradeLevel,
            academicYear: data.academicYearId,
            feeType: "transport",
            isActive: true,
          });
          if (transportFee) {
            lineItems.push({
              feeType: "transport",
              description: "Transport Fee",
              descriptionAr: "رسوم النقل",
              amount: transportFee.amount,
              discountAmount: 0,
              netAmount: transportFee.amount,
            });
          }
        }
      }
    }

    // 7. Add cafeteria prepaid if applicable
    if (data.includeCafeteria && data.cafeteriaAmount) {
      lineItems.push({
        feeType: "cafeteria",
        description: "Cafeteria Prepaid",
        descriptionAr: "اشتراك الكافيتيريا المسبق",
        amount: data.cafeteriaAmount,
        discountAmount: 0,
        netAmount: data.cafeteriaAmount,
      });
    }

    if (lineItems.length === 0) {
      return { success: false, error: "No line items to invoice" };
    }

    // 8. Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const totalDiscount = lineItems.reduce(
      (sum, item) => sum + item.discountAmount,
      0
    );
    const total = subtotal - totalDiscount;

    // 9. Create invoice
    const invoiceNumber = generateInvoiceNumber();
    const etaUuid = uuidv4(); // Pre-generate UUID for ETA Egypt

    const invoice = await Invoice.create({
      invoiceNumber,
      student: data.studentId,
      academicYear: data.academicYearId,
      term: data.termId,
      lineItems,
      subtotal,
      totalDiscount,
      tax: 0, // Schools are typically tax-exempt in Egypt
      total,
      paidAmount: 0,
      balanceDue: total,
      status: "issued",
      dueDate: new Date(data.dueDate),
      issuedDate: new Date(),
      etaUuid,
      notes: data.notes,
      createdBy: session.user.id,
    });

    // 10. Create installments if requested
    if (data.installmentCount && data.installmentCount > 1) {
      const installmentAmount = Math.floor(total / data.installmentCount);
      const remainder = total - installmentAmount * data.installmentCount;

      for (let i = 0; i < data.installmentCount; i++) {
        const dueDate = new Date(data.dueDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        await Installment.create({
          invoice: invoice._id,
          student: data.studentId,
          installmentNumber: i + 1,
          dueDate,
          amount:
            i === data.installmentCount - 1
              ? installmentAmount + remainder
              : installmentAmount,
          paidAmount: 0,
          status: "pending",
        });
      }
    }

    // 11. If cafeteria was included, top up the wallet
    if (data.includeCafeteria && data.cafeteriaAmount) {
      await StudentCanteenWallet.findOneAndUpdate(
        { student: data.studentId },
        {
          $inc: { balance: data.cafeteriaAmount },
          $set: { lastTopUp: new Date(), isActive: true },
        },
        { upsert: true }
      );
    }

    return {
      success: true,
      data: {
        invoiceId: invoice._id.toString(),
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        installments: data.installmentCount,
      },
    };
  } catch (error) {
    console.error("createInvoiceWithTransportAndCanteen error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
