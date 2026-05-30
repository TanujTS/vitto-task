import { z } from "zod";
import { applicationStatuses, preferredLanguages, type ApplicationStatus, type PreferredLanguage } from "@vitto/types";

export const createApplicationSchema = z.object({
  name: z.string().trim().min(1, "Applicant name is required").max(120, "Applicant name is too long"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number"),
  amount: z.coerce
    .number({ error: "Loan amount is required" })
    .positive("Loan amount must be greater than 0")
    .max(10_000_000, "Loan amount is too high"),
  purpose: z.string().trim().min(1, "Loan purpose is required").max(240, "Loan purpose is too long"),
  language: z.enum(preferredLanguages, { error: "Preferred language is invalid" }),
});

export const applicationStatusSchema = z.object({
  status: z.enum(applicationStatuses, { error: "Status must be pending, approved, or rejected" }),
});

export const applicationQuerySchema = z.object({
  status: z.enum(applicationStatuses, { error: "Status filter must be pending, approved, or rejected" }).optional(),
});

export const applicationIdSchema = z.object({
  id: z.uuid("Application id must be a valid UUID"),
});

export interface ApplicationRow {
  id: string;
  name: string;
  mobile: string;
  amount: string;
  purpose: string;
  language: PreferredLanguage;
  status: ApplicationStatus;
  created_at: Date;
}
