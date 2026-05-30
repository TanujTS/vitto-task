import { type Application, type CreateApplicationInput, type ApplicationStatus, type ApplicationSummary } from "@vitto/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchApplications(status?: ApplicationStatus): Promise<Application[]> {
  const url = new URL(`${API_BASE_URL}/applications`);
  if (status) {
    url.searchParams.append("status", status);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }
  const data = await response.json();
  return data.data; // Assuming responseOk returns { success: true, data: [...] }
}

export async function createApplication(input: CreateApplicationInput): Promise<{ application: Application; referenceNumber: string }> {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create application");
  }
  const data = await response.json();
  return data.data;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application> {
  const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update application status");
  }
  const data = await response.json();
  return data.data;
}

export async function fetchSummary(): Promise<ApplicationSummary> {
  const response = await fetch(`${API_BASE_URL}/applications/summary`);
  if (!response.ok) {
    throw new Error("Failed to fetch applications summary");
  }
  const data = await response.json();
  return data.data;
}
