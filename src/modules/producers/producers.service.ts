import { UserRole } from '@prisma/client';

import { AppError } from '../../utils/app-error';
import type { AuthenticatedUser } from '../../types/auth';
import { toProducerProfileResponse } from './producers.mapper';
import { producersRepository } from './producers.repository';
import type { UpdateProducerProfileInput } from './producers.schema';

const resolveNextPriceBounds = (
  existingMin: number | null,
  existingMax: number | null,
  updates: UpdateProducerProfileInput,
) => {
  const nextMin = updates.priceRangeMin === undefined ? existingMin : updates.priceRangeMin;
  const nextMax = updates.priceRangeMax === undefined ? existingMax : updates.priceRangeMax;

  if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
    throw new AppError(400, 'priceRangeMax must be greater than or equal to priceRangeMin');
  }
};

export const producersService = {
  async getMyProfile(authUser: AuthenticatedUser) {
    if (authUser.role !== UserRole.PRODUCER) {
      throw new AppError(403, 'Only producers can access a producer profile');
    }

    const profile = await producersRepository.findByUserId(authUser.id);

    if (!profile) {
      throw new AppError(404, 'Producer profile not found');
    }

    return {
      profile: toProducerProfileResponse(profile),
    };
  },

  async updateMyProfile(authUser: AuthenticatedUser, payload: UpdateProducerProfileInput) {
    if (authUser.role !== UserRole.PRODUCER) {
      throw new AppError(403, 'Only producers can update a producer profile');
    }

    const existingProfile = await producersRepository.findByUserId(authUser.id);

    if (!existingProfile) {
      throw new AppError(404, 'Producer profile not found');
    }

    resolveNextPriceBounds(
      producersRepository.toNullableNumber(existingProfile.priceRangeMin),
      producersRepository.toNullableNumber(existingProfile.priceRangeMax),
      payload,
    );

    const updatedProfile = await producersRepository.updateByUserId(authUser.id, payload);

    return {
      profile: toProducerProfileResponse(updatedProfile),
    };
  },

  async getProducerById(id: string) {
    const profile = await producersRepository.findById(id);

    if (!profile) {
      throw new AppError(404, 'Producer profile not found');
    }

    return {
      profile: toProducerProfileResponse(profile),
    };
  },
};
