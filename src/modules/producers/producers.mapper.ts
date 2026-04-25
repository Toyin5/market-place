import { Prisma } from '@prisma/client';

import type { ProducerProfileWithUser } from './producers.repository';

type DecimalLike = Prisma.Decimal | string | number | null;

type ProducerProfileCore = {
  id: string;
  businessName: string;
  description: string;
  locationState: string;
  locationCity: string;
  address: string;
  fabricTypes: string[];
  priceRangeMin: DecimalLike;
  priceRangeMax: DecimalLike;
  minimumOrderQuantity: number;
  deliveryAvailable: boolean;
  whatsappNumber: string;
  profileImageUrl: string | null;
  isVerified: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
};

const toNullableNumber = (value: DecimalLike) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  return Number(value.toString());
};

const serializeProducerProfileCore = (profile: ProducerProfileCore) => ({
  id: profile.id,
  businessName: profile.businessName,
  description: profile.description,
  locationState: profile.locationState,
  locationCity: profile.locationCity,
  address: profile.address,
  fabricTypes: profile.fabricTypes,
  priceRangeMin: toNullableNumber(profile.priceRangeMin),
  priceRangeMax: toNullableNumber(profile.priceRangeMax),
  minimumOrderQuantity: profile.minimumOrderQuantity,
  deliveryAvailable: profile.deliveryAvailable,
  whatsappNumber: profile.whatsappNumber,
  profileImageUrl: profile.profileImageUrl,
  isVerified: profile.isVerified,
  ratingAverage: profile.ratingAverage,
  ratingCount: profile.ratingCount,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

export const toEmbeddedProducerProfile = (profile: ProducerProfileCore) => {
  return serializeProducerProfileCore(profile);
};

export const toProducerProfileResponse = (profile: ProducerProfileWithUser) => ({
  ...serializeProducerProfileCore(profile),
  owner: {
    id: profile.user.id,
    fullName: profile.user.fullName,
  },
});
