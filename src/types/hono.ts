import type { AuthenticatedUser } from './auth';

export type AppBindings = {
  Variables: {
    authUser: AuthenticatedUser;
  };
};
