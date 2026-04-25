import type { UserRole } from '@prisma/client';

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedUser extends AuthTokenPayload {}
