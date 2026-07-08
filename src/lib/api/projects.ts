import { apiRequest } from "@/lib/api/client";
import type { CreateProjectPayload, Project, UpdateProjectPayload } from "@/lib/types/project";

export function getProjects() {
  return apiRequest<Project[]>("/projects");
}

export function createProject(payload: CreateProjectPayload) {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: payload,
  });
}

export function getProject(projectId: string) {
  return apiRequest<Project>(`/projects/${projectId}`);
}

export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  return apiRequest<Project>(`/projects/${projectId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProject(projectId: string) {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: "DELETE",
  });
}
