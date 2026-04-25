import bcrypt from 'bcrypt';

import { env } from '../config/env';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (password: string, passwordHash: string) => {
  return bcrypt.compare(password, passwordHash);
};
