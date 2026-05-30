import type { Request, Response } from "express";
import { pool } from "../db/pool";
import { ApiError } from "../util/api-error";
import { responseCreated, responseOk } from "../util/api-response";
import {
  applicationIdSchema,
  applicationQuerySchema,
  applicationStatusSchema,
  createApplicationSchema,
  type ApplicationRow,
} from "../validators/application-validator";
import {
  applicationStatuses,
  type Application,
  type ApplicationStatus,
  type ApplicationSummary,
} from "@vitto/types";

const formatZodError = (error: { issues: unknown[] }) => error.issues;

const parseRequest = <T>(
  result:
    | { success: true; data: T }
    | { success: false; error: { issues: unknown[] } },
) => {
  if (!result.success) {
    throw new ApiError(
      400,
      "Invalid request data",
      formatZodError(result.error),
    );
  }

  return result.data;
};

const toApplication = (row: ApplicationRow): Application => ({
  id: row.id,
  name: row.name,
  mobile: row.mobile,
  amount: Number(row.amount),
  purpose: row.purpose,
  language: row.language,
  status: row.status,
  createdAt: row.created_at.toISOString(),
});

export const createApplication = async (req: Request, res: Response) => {
  const input = parseRequest(createApplicationSchema.safeParse(req.body));

  const result = await pool.query<ApplicationRow>(
    `INSERT INTO applications (name, mobile, amount, purpose, language)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, mobile, amount, purpose, language, status, created_at`,
    [input.name, input.mobile, input.amount, input.purpose, input.language],
  );

  const row = result.rows[0];
  if (!row) {
    throw new ApiError(500, "Failed to create application");
  }

  const application = toApplication(row);
  return responseCreated(
    req,
    res,
    { application, referenceNumber: application.id },
    "Application submitted",
  );
};

export const getApplications = async (req: Request, res: Response) => {
  const query = parseRequest(applicationQuerySchema.safeParse(req.query));

  const result = await pool.query<ApplicationRow>(
    `SELECT id, name, mobile, amount, purpose, language, status, created_at
    FROM applications
    WHERE ($1::application_status IS NULL OR status = $1::application_status)
    ORDER BY created_at DESC`,
    [query.status ?? null],
  );

  return responseOk(
    req,
    res,
    result.rows.map(toApplication),
    "Applications fetched",
  );
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { id } = parseRequest(applicationIdSchema.safeParse(req.params));
  const { status } = parseRequest(applicationStatusSchema.safeParse(req.body));

  const result = await pool.query<ApplicationRow>(
    `UPDATE applications
    SET status = $1::application_status
    WHERE id = $2
    RETURNING id, name, mobile, amount, purpose, language, status, created_at`,
    [status, id],
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, "Application not found");
  }

  const row = result.rows[0];
  if (!row) {
    throw new ApiError(500, "Failed to update application status");
  }

  return responseOk(req, res, toApplication(row), "Application status updated");
};

export const getSummary = async (req: Request, res: Response) => {
  const result = await pool.query<{
    total_applications: string;
    total_loan_amount_requested: string | null;
    pending_count: string;
    approved_count: string;
    rejected_count: string;
  }>(
    `SELECT
      COUNT(*) AS total_applications,
      COALESCE(SUM(amount), 0) AS total_loan_amount_requested,
      COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
      COUNT(*) FILTER (WHERE status = 'approved') AS approved_count,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected_count
    FROM applications`,
  );

  const row = result.rows[0];
  if (!row) {
    throw new ApiError(500, "Failed to fetch summary");
  }

  const statusCounts = applicationStatuses.reduce(
    (counts, status) => ({ ...counts, [status]: 0 }),
    {} as Record<ApplicationStatus, number>,
  ); // first one is accumulator, second one is the current iterated value

  const summary: ApplicationSummary = {
    totalApplications: Number(row.total_applications),
    totalLoanAmountRequested: Number(row.total_loan_amount_requested ?? 0),
    statusCounts: {
      ...statusCounts,   
      pending: Number(row.pending_count),
      approved: Number(row.approved_count),
      rejected: Number(row.rejected_count), //typesafe, because if those are null, atleast 0 are written, else overwritten
    },
  };

  return responseOk(req, res, summary, "Summary fetched");
};
