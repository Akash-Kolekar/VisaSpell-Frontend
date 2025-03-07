// roles.ts

export const ROLES = {
  STUDENT: "student",
  UNIVERSITY: "university",
  EMBASSY: "embassy",
  ADMIN: "admin",
  VERIFIER: "verifier",
};

// Assign roles to specific addresses.
// Ensure that addresses are stored in lowercase for consistency.
export const USER_ROLES: Record<string, string[]> = {
  "0xb58634c4465d93a03801693fd6d76997c797e42a": [
    ROLES.STUDENT,
    ROLES.UNIVERSITY,
    ROLES.EMBASSY,
    ROLES.ADMIN,
    ROLES.VERIFIER,
  ],
  // Add other addresses if needed...
};

// Optional helper function
export function getUserRoles(address: string): string[] {
  return USER_ROLES[address.toLowerCase()] || [];
}
