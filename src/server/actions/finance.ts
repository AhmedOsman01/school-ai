"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { Invoice, Student, FeeStructure, AcademicYear } from "@/models";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const InvoiceSchema = z.object({
  studentId: z.string().min(1),
  feeItems: z.array(z.object({
    feeType: z.string(),
    amount: z.number().min(0),
    description: z.string()
  })),
  dueDate: z.string(),
});

export async function createInvoice(input: z.infer<typeof InvoiceSchema>) {
  try {
    const session = await auth();
    if (!session || !["admin", "accountant"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const data = InvoiceSchema.parse(input);

    const activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) return { success: false, error: "No active academic year found" };

    const subtotal = data.feeItems.reduce((acc, item) => acc + item.amount, 0);
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      student: data.studentId,
      academicYear: activeYear._id,
      lineItems: data.feeItems,
      subtotal,
      totalDiscount: 0,
      tax: 0,
      total: subtotal,
      paidAmount: 0,
      balanceDue: subtotal,
      status: "issued",
      dueDate: new Date(data.dueDate),
      issuedDate: new Date(),
      createdBy: session.user.id,
    });

    revalidatePath("/dashboard/finance");
    return { success: true, invoiceId: invoice._id.toString() };
  } catch (error: any) {
    console.error("Invoice creation error:", error);
    return { success: false, error: error.message };
  }
}
