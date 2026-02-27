import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invoice from "@/models/Invoice";
import Student from "@/models/Student";
import { triggerN8nWebhook } from "@/lib/webhooks";
import type { IInvoiceReminderPayload } from "@/types";

/**
 * POST /api/webhooks/invoice-reminder
 * 
 * Triggers invoice reminders via n8n.
 * Can be called by cron job or manually.
 * 
 * Body: { invoiceId } or { daysBeforeDue: number } for batch
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, daysBeforeDue } = body;

    await connectDB();

    let invoices;

    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId)
        .populate("student", "nameAr nameEn guardians")
        .populate({
          path: "student",
          populate: {
            path: "guardians.guardian",
            select: "phone",
          },
        });
      invoices = invoice ? [invoice] : [];
    } else {
      // Batch: find invoices due within X days
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + (daysBeforeDue || 7));

      invoices = await Invoice.find({
        status: { $in: ["issued", "partially_paid"] },
        dueDate: { $lte: targetDate },
        balanceDue: { $gt: 0 },
      })
        .populate("student", "nameAr nameEn")
        .limit(100);
    }

    const results = [];

    for (const invoice of invoices) {
      const studentData = invoice.student as unknown as {
        nameAr: string;
        guardians?: Array<{
          guardian: { phone?: string };
          isPrimary: boolean;
        }>;
      };

      const primaryGuardian = studentData.guardians?.find(
        (g) => g.isPrimary
      );

      const payload: IInvoiceReminderPayload = {
        event: "invoice.reminder",
        timestamp: new Date().toISOString(),
        data: {
          studentId: (invoice.student as { _id: { toString(): string } })._id.toString(),
          studentName: studentData.nameAr,
          guardianPhone: primaryGuardian?.guardian?.phone || "",
          invoiceNumber: invoice.invoiceNumber,
          balanceDue: invoice.balanceDue,
          dueDate: invoice.dueDate.toISOString(),
        },
      };

      const result = await triggerN8nWebhook("invoice-reminder", payload);
      results.push({ invoiceNumber: invoice.invoiceNumber, forwarded: result.success });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Invoice reminder webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
