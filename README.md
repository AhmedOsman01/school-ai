# 🎓 EduFlow Egypt — نظام إدارة المدارس

<div align="center">

**A modern, scalable School Management System for the Egyptian education market.**

Built with Next.js 14+ • TypeScript • MongoDB • Tailwind CSS • next-intl (AR/EN RTL-first)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Data Models](#data-models)
- [Authentication & Authorization](#authentication--authorization)
- [n8n Integration Guide](#n8n-integration-guide)
- [WhatsApp Business API](#whatsapp-business-api)
- [ETA Egypt e-Invoicing](#eta-egypt-e-invoicing)
- [API Reference](#api-reference)
- [Development](#development)

---

## Overview

EduFlow Egypt is a comprehensive SaaS school management platform designed specifically for the Egyptian education market. It supports:

- **Multi-role access**: Admin, Teacher, Student, Parent, Accountant, Driver, Staff
- **Full academic lifecycle**: Years, terms, grades, classes, timetables, attendance
- **Assessment system**: Assignments, exams, results, GPA/ranking
- **Financial management**: Egypt-compliant invoicing, installments, ETA e-invoicing
- **Transportation**: Bus management, route tracking, GPS, bus attendance
- **Cafeteria**: Wallet-based ordering, menu management, inventory
- **Communication**: Targeted announcements, n8n automation, WhatsApp alerts
- **Bilingual**: Arabic-first RTL design with full English support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ App Router, TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui (planned) |
| i18n | next-intl (Arabic + English, RTL-first) |
| Backend | Next.js API Routes + Server Actions |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js v5 (Credentials + Google) |
| State | Zustand |
| Automation | n8n (self-hosted) |
| Messaging | WhatsApp Business API |
| e-Invoicing | ETA Egypt API |
| File Storage | uploadthing |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (RTL-aware)
│   ├── page.tsx                  # Root redirect
│   ├── globals.css               # Design system & tokens
│   ├── login/
│   │   └── page.tsx              # Login page (Credentials + Google)
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard shell (sidebar + topbar)
│   │   └── page.tsx              # Dashboard home
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handlers
│       ├── students/             # Protected student API
│       └── webhooks/             # n8n webhook endpoints
│           ├── attendance-alert/
│           ├── invoice-reminder/
│           ├── exam-result/
│           ├── bus-absence/
│           └── low-wallet-balance/
├── models/                       # Mongoose schemas (32 models)
│   ├── Person.ts                 # Base (discriminator)
│   ├── Student.ts                # → Person discriminator
│   ├── Teacher.ts                # → Person discriminator
│   ├── Guardian.ts               # → Person discriminator
│   ├── Driver.ts                 # → Person discriminator
│   ├── Staff.ts                  # → Person discriminator
│   ├── User.ts                   # Auth user
│   ├── AcademicYear.ts
│   ├── Term.ts
│   ├── GradeLevel.ts
│   ├── ClassGroup.ts
│   ├── Subject.ts
│   ├── CurriculumItem.ts
│   ├── Timetable.ts
│   ├── ScheduleSlot.ts
│   ├── Attendance.ts
│   ├── Assignment.ts
│   ├── Submission.ts
│   ├── Exam.ts
│   ├── StudentExamResult.ts
│   ├── TermSummary.ts
│   ├── FeeStructure.ts
│   ├── Discount.ts
│   ├── Invoice.ts                # ETA e-invoicing ready
│   ├── Payment.ts
│   ├── Allocation.ts
│   ├── Installment.ts
│   ├── Bus.ts
│   ├── Route.ts                  # GPS points & stops
│   ├── StudentTransportAssignment.ts
│   ├── BusAttendance.ts
│   ├── CanteenItem.ts
│   ├── Menu.ts
│   ├── StudentCanteenWallet.ts
│   ├── CanteenOrder.ts
│   ├── CanteenTransaction.ts
│   ├── Announcement.ts
│   └── index.ts                  # Barrel export
├── lib/                          # Core utilities
│   ├── db.ts                     # MongoDB connection (singleton)
│   ├── auth.ts                   # NextAuth v5 config
│   ├── rbac.ts                   # Role-based access control
│   ├── webhooks.ts               # n8n + WhatsApp helpers
│   └── eta.ts                    # ETA Egypt e-invoicing
├── types/
│   └── index.ts                  # All TypeScript interfaces & enums
├── store/
│   └── index.ts                  # Zustand stores
├── server/
│   └── actions/
│       └── invoice.ts            # Server Action example
├── i18n/
│   ├── request.ts                # next-intl config
│   └── messages/
│       ├── ar.json               # Arabic translations
│       └── en.json               # English translations
└── scripts/
    └── seed.ts                   # Database seeder
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** 6+ (local or Atlas)
- **n8n** (optional, for automation workflows)

### 1. Clone & Install

```bash
cd school-ai
npm install
```

### 2. Start Infrastructure (Docker)

If you don't have MongoDB installed locally, use the provided Docker Compose file:

```bash
docker-compose up -d
```
This will start MongoDB (27017) and n8n (5678).

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/eduflow-egypt
AUTH_SECRET=your-secret-key-here

# Optional
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
N8N_WEBHOOK_BASE_URL=http://localhost:5678/webhook
```

### 3. Seed the Database

```bash
npx tsx src/scripts/seed.ts
```

This creates test accounts:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eduflow.eg | admin123 |
| Parent | ahmed.hassan@gmail.com | admin123 |
| Teacher | fatma.ali@eduflow.eg | admin123 |

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Data Models

### Person Discriminator Pattern

All person entities share a base `Person` model with `personType` as the discriminator key:

```
Person (base)
├── Student    → studentId, gradeLevel, classGroup, guardians[]
├── Teacher    → employeeId, subjects[], qualifications
├── Guardian   → students[], occupation, emergencyContact
├── Driver     → licenseNumber, licenseExpiry, bus
└── Staff      → department, position
```

### Model Relationships

```
AcademicYear ──┬── Term
               ├── ClassGroup ── GradeLevel
               └── FeeStructure

Student ──┬── Attendance
          ├── Submission ── Assignment
          ├── StudentExamResult ── Exam
          ├── TermSummary
          ├── Invoice ──┬── Payment ── Allocation
          │             └── Installment
          ├── StudentTransportAssignment ── Bus ── Route
          ├── StudentCanteenWallet ── CanteenTransaction
          └── CanteenOrder

Timetable ── ScheduleSlot (subject + teacher + room)
```

### Key Indexes

| Collection | Index | Purpose |
|-----------|-------|---------|
| persons | `{ personType: 1, isActive: 1 }` | Discriminator queries |
| attendance | `{ student: 1, date: 1 }` (unique) | One per student/day |
| schedule_slots | `{ timetable: 1, dayOfWeek: 1, periodNumber: 1 }` (unique) | Prevent double-booking |
| invoices | `{ student: 1, academicYear: 1, status: 1 }` | Financial lookups |
| bus_attendance | `{ student: 1, bus: 1, date: 1 }` (unique) | One per boarding |
| term_summaries | `{ student: 1, term: 1, academicYear: 1 }` (unique) | One summary per term |

---

## Authentication & Authorization

### NextAuth.js v5 Setup

- **Credentials provider**: Email + password (bcrypt hashed)
- **Google OAuth**: Optional, for staff/parent convenience
- **JWT strategy**: Role and personId stored in token
- **Session**: Available via `auth()` helper

### Role-Based Access Control

```typescript
import { requireRole } from "@/lib/rbac";

// In API route:
const check = await requireRole("admin", "accountant");
if (!check.authorized) {
  return errorResponse(check.error, check.status);
}
```

### Role Hierarchy

```
admin (100) > accountant (80) > teacher (60) > staff (50) > driver (40) > parent (20) > student (10)
```

---

## n8n Integration Guide

### Setup n8n

```bash
# Docker (recommended)
docker run -d --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Or npm
npm install -g n8n && n8n start
```

### Webhook Endpoints

| Endpoint | Trigger | Payload |
|----------|---------|---------|
| `/api/webhooks/attendance-alert` | Student absent/late | studentName, guardianPhone, status, date |
| `/api/webhooks/invoice-reminder` | Invoice approaching due date | invoiceNumber, balanceDue, dueDate |
| `/api/webhooks/exam-result` | Exam results published | examTitle, marksObtained, grade |
| `/api/webhooks/bus-absence` | Student absent from bus | busNumber, route, date |
| `/api/webhooks/low-wallet-balance` | Wallet below threshold | currentBalance, threshold |

### n8n Workflow Example: Attendance Alert

1. **Create Webhook node** in n8n → set to `POST` method
2. **Copy the webhook URL** → set as `N8N_WEBHOOK_BASE_URL` in `.env.local`
3. **Add IF node**: Check if `status === "absent"`
4. **Add WhatsApp node**: Send template message to `guardianPhone`
5. **Add Email node**: CC the teacher

### n8n Workflow: Invoice Reminder

```
Cron (daily 9am)
  → HTTP Request POST /api/webhooks/invoice-reminder
    body: { "daysBeforeDue": 3 }
  → Filter (balanceDue > 0)
  → WhatsApp Template Message
  → SMS Fallback
```

---

## WhatsApp Business API

### Template Messages (pre-registered with Meta)

| Template | Variables | Language |
|----------|-----------|----------|
| `attendance_alert_ar` | student_name, status, date | ar |
| `invoice_reminder_ar` | student_name, amount, due_date | ar |
| `exam_result_ar` | student_name, subject, grade | ar |
| `bus_delay_ar` | student_name, bus_number, eta | ar |
| `wallet_low_ar` | student_name, balance | ar |

### Usage

```typescript
import { sendWhatsAppMessage } from "@/lib/webhooks";

await sendWhatsAppMessage({
  to: "+201001234567",
  templateName: "attendance_alert_ar",
  languageCode: "ar",
  components: [
    {
      type: "body",
      parameters: [
        { type: "text", text: "يوسف أحمد" },
        { type: "text", text: "غائب" },
        { type: "text", text: "2025-10-15" },
      ],
    },
  ],
});
```

---

## ETA Egypt e-Invoicing

### Setup

1. Register at [ETA Portal](https://invoicing.eta.gov.eg)
2. Obtain `client_id` and `client_secret`
3. Add to `.env.local`:

```env
ETA_API_URL=https://api.invoicing.eta.gov.eg/api/v1
ETA_CLIENT_ID=your-client-id
ETA_CLIENT_SECRET=your-client-secret
ETA_TAXPAYER_ID=your-tax-id
```

### Invoice Flow

1. Invoice created → UUID auto-generated
2. Invoice approved → Submit to ETA API
3. ETA returns `submissionId` → stored on invoice
4. QR code generated for printing

---

## API Reference

### Protected Routes

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/students` | admin, teacher | List students (paginated) |

### Query Parameters (Students)

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (max: 100) |
| search | string | Search name or ID |
| gradeLevel | ObjectId | Filter by grade |
| classGroup | ObjectId | Filter by class |

### Server Actions

| Action | Roles | Description |
|--------|-------|-------------|
| `createInvoiceWithTransportAndCanteen` | admin, accountant | Create multi-line invoice with transport + cafeteria |

---

## Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npx tsx src/scripts/seed.ts  # Seed database
```

### Code Style

- **TypeScript strict mode** with `noUncheckedIndexedAccess`
- **Mongoose discriminators** for the Person hierarchy
- **Barrel exports** for models (`import { Student } from "@/models"`)
- **Zod validation** in server actions
- **i18n keys** in `ar.json` / `en.json`

### Adding a New Model

1. Create `src/models/YourModel.ts` with schema + indexes
2. Add interface to `src/types/index.ts`
3. Export from `src/models/index.ts`
4. Add translations to `src/i18n/messages/ar.json` and `en.json`

### Adding a New Webhook

1. Create `src/app/api/webhooks/your-webhook/route.ts`
2. Add payload type to `src/types/index.ts`
3. Create n8n workflow with matching endpoint
4. Document in this README

---

## License

Private — All rights reserved.

---

<div align="center">

**Built with ❤️ for Egyptian schools**

EduFlow Egypt © 2025

</div>
# school-ai
# school-ai
