import { auth } from "./auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: (session.user as any).id,
    fullName: (session.user).fullName,
    email: (session.user).email,
    role: (session.user).role,
  };
}

export function hasRole(role: string): Promise<boolean> {
  return getCurrentUser().then((u) => u?.role === role || false);
}

export function hasAnyRole(roles: string[]): Promise<boolean> {
  return getCurrentUser().then((u) => roles.includes(u?.role || ""));
}

export function canEdit(role: string): boolean {
  const editRoles = ["ADMIN", "FOUNDER", "PROJECT_MANAGER", "PROJECT_OWNER", "DOCUMENTATION_OWNER"];
  return editRoles.includes(role);
}

export function canView(role: string, minRole: string): boolean {
  const roles = ["ADMIN", "FOUNDER", "PROJECT_MANAGER", "PROJECT_OWNER", "DOCUMENTATION_OWNER", "TEAM_MEMBER", "NEW_EMPLOYEE"];
  const userIdx = roles.indexOf(role);
  const minIdx = roles.indexOf(minRole);
  return userIdx >= 0 && minIdx >= 0 && userIdx >= minIdx;
}
