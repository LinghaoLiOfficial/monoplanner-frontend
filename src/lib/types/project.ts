export type Project = {
  id: string;
  name: string;
  description: string | null;
  target_frontend_stack?: string;
  target_backend_stack?: string;
  target_stacks_configured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateProjectPayload = {
  name: string;
};

export type UpdateProjectPayload = {
  name?: string | null;
  description?: string | null;
  status?: string | null;
  target_frontend_stack?: string;
  target_backend_stack?: string;
};
