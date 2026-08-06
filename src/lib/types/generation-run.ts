export type GenerationRun = {
  id: string;
  project_id: string;
  requirement_id?: string | null;
  run_type: string;
  status: string;
  progress: number;
  message?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
};
