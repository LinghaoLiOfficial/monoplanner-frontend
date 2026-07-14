import { apiRequest } from "@/lib/api/client";
import type {
  AdminUser,
  AdminUserListResponse,
  NonAdminUserRole,
  UserRole,
} from "@/lib/types/user";

export type ListAdminUsersParams = {
  q?: string;
  role?: UserRole;
  is_active?: boolean;
  page?: number;
  page_size?: number;
};

export type UpdateAdminUserInput = {
  role?: NonAdminUserRole;
  is_active?: boolean;
  display_name?: string | null;
};

export function listAdminUsers(params?: ListAdminUsersParams) {
  return apiRequest<AdminUserListResponse>("/admin/users", {
    query: params,
  });
}

export function updateAdminUser(userId: string, input: UpdateAdminUserInput) {
  return apiRequest<AdminUser>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: input,
  });
}

export function enableAdminUser(userId: string) {
  return apiRequest<AdminUser>(`/admin/users/${userId}/enable`, {
    method: "POST",
  });
}

export function disableAdminUser(userId: string) {
  return apiRequest<AdminUser>(`/admin/users/${userId}/disable`, {
    method: "POST",
  });
}
