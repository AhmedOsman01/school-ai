import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudentCanteenWallet from "@/models/StudentCanteenWallet";
import Student from "@/models/Student";
import { triggerN8nWebhook } from "@/lib/webhooks";
import type { ILowWalletPayload } from "@/types";

/**
 * POST /api/webhooks/low-wallet-balance
 * 
 * Alerts parents when wallet balance drops below threshold.
 * Can be triggered by cron or after each transaction.
 * 
 * Body: { threshold?: number } - default 50 EGP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const threshold = body.threshold || 50; // Default 50 EGP

    await connectDB();

    const lowWallets = await StudentCanteenWallet.find({
      balance: { $lte: threshold },
      isActive: true,
    })
      .populate({
        path: "student",
        select: "nameAr nameEn guardians",
        populate: {
          path: "guardians.guardian",
          select: "phone",
        },
      })
      .limit(200);

    const results = [];

    for (const wallet of lowWallets) {
      const student = wallet.student as unknown as {
        _id: { toString(): string };
        nameAr: string;
        guardians?: Array<{
          guardian: { phone?: string };
          isPrimary: boolean;
        }>;
      };

      if (!student) continue;

      const primaryGuardian = student.guardians?.find((g) => g.isPrimary);

      const payload: ILowWalletPayload = {
        event: "wallet.low_balance",
        timestamp: new Date().toISOString(),
        data: {
          studentId: student._id.toString(),
          studentName: student.nameAr,
          guardianPhone: primaryGuardian?.guardian?.phone || "",
          currentBalance: wallet.balance,
          threshold,
        },
      };

      const result = await triggerN8nWebhook("low-wallet-balance", payload);
      results.push({
        studentId: student._id.toString(),
        balance: wallet.balance,
        forwarded: result.success,
      });
    }

    return NextResponse.json({
      success: true,
      threshold,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Low wallet balance webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
