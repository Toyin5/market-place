import { Prisma, UserRole } from '@prisma/client';

import type { AuthenticatedUser } from '../../types/auth';
import { AppError } from '../../utils/app-error';
import { createAccessToken } from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/password';
import { toUserResponse } from '../users/users.mapper';
import { usersRepository } from '../users/users.repository';
import type { LoginInput, RegisterInput } from './auth.schema';

export const authService = {
  async register(payload: RegisterInput) {
    const existingUser = await usersRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new AppError(409, 'An account with this email already exists');
    }

    const passwordHash = await hashPassword(payload.password);

    const userData: Prisma.UserCreateInput = {
      fullName: payload.fullName,
      email: payload.email,
      passwordHash,
      phoneNumber: payload.phoneNumber,
      role: payload.role,
    };

    if (payload.role === UserRole.PRODUCER) {
      userData.producerProfile = {
        create: {
          businessName: payload.businessName,
          description: payload.description,
          locationState: payload.locationState,
          locationCity: payload.locationCity,
          address: payload.address,
          fabricTypes: payload.fabricTypes,
          minimumOrderQuantity: payload.minimumOrderQuantity,
          deliveryAvailable: payload.deliveryAvailable,
          whatsappNumber: payload.whatsappNumber,
        },
      };
    }

    const user = await usersRepository.create(userData);
    const accessToken = await createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: accessToken,
      user: toUserResponse(user),
    };
  },

  async login(payload: LoginInput) {
    const user = await usersRepository.findByEmail(payload.email);

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(payload.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = await createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: accessToken,
      user: toUserResponse(user),
    };
  },

  async getCurrentUser(authUser: AuthenticatedUser) {
    const user = await usersRepository.findById(authUser.id);

    if (!user) {
      throw new AppError(404, 'User account not found');
    }

    return {
      user: toUserResponse(user),
    };
  },
};
