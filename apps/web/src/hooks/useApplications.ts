import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApplicationStatus, type CreateApplicationInput } from "@vitto/types";
import { fetchApplications, createApplication, updateApplicationStatus, fetchSummary } from "../lib/api";

export function useApplications(status?: ApplicationStatus) {
  return useQuery({
    queryKey: ["applications", status],
    queryFn: () => fetchApplications(status),
  });
}

export function useApplicationSummary() {
  return useQuery({
    queryKey: ["applications-summary"],
    queryFn: fetchSummary,
  });
}

export function useAddApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-summary"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-summary"] });
    },
  });
}
