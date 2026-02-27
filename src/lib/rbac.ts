import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types";

/**
 * Middleware helper: Check if current user has required role(s)
 */
export async function requireRole(...allowedRoles: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    return {
      authorized: false,
      error: "Unauthorized: Not logged in",
      status: 401,
      session: null,
    } as const;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return {
      authorized: false,
      error: `Forbidden: Requires one of [${allowedRoles.join(", ")}]`,
      status: 403,
      session: null,
    } as const;
  }

  return {
    authorized: true,
    error: null,
    status: 200,
    session,
  } as const;
}

/**
 * Create a JSON error response
 */
export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a JSON success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ data }, { status });
}

import { ROLE_HIERARCHY } from "@/lib/menu";
export { type MenuItem, ROLE_MENUS, hasMinRole } from "@/lib/menu";

