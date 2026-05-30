export const applicationStatuses = ["pending", "approved", "rejected"] as const;
export const preferredLanguages = ["Hindi", "Tamil", "Telugu", "Marathi", "English"] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type PreferredLanguage = (typeof preferredLanguages)[number];

export interface CreateApplicationInput {
  name: string;
  mobile: string;
  amount: number;
  purpose: string;
  language: PreferredLanguage;
}

export interface Application {
  id: string;
  name: string;
  mobile: string;
  amount: number;
  purpose: string;
  language: PreferredLanguage;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApplicationSummary {
  totalApplications: number;
  totalLoanAmountRequested: number;
  statusCounts: Record<ApplicationStatus, number>;
}
