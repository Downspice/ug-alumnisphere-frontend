import type { AuthUser } from "@/lib/api/services/auth.service";

const PROFILE_FIELDS: Array<keyof AuthUser> = [
  "name",
  "headline",
  "about",
  "location",
  "graduationYear",
  "programme",
  "department",
  "industry",
  "company",
  "jobTitle",
  "skills",
  "avatarUrl",
];

export function getProfileCompletion(user: AuthUser | null): number {
  if (!user) return 0;
  const filled = PROFILE_FIELDS.filter((field) => {
    const value = user[field];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "number") return value > 0;
    return Boolean(value && String(value).trim());
  }).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}
