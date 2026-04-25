import { Prisma } from '@prisma/client';

import { toTitleCase } from '../../utils/normalizers';
import { toProducerProfileResponse } from '../producers/producers.mapper';
import {
  producersRepository,
  type ProducerProfileWithUser,
} from '../producers/producers.repository';
import type { MarketplaceSearchInput } from './marketplace.schema';

const matchesFabricType = (profile: ProducerProfileWithUser, fabricType?: string) => {
  if (!fabricType) {
    return true;
  }

  const normalizedFilter = toTitleCase(fabricType).toLowerCase();

  return profile.fabricTypes.some((item) => item.toLowerCase() === normalizedFilter);
};

const matchesSearchText = (profile: ProducerProfileWithUser, search?: string) => {
  if (!search) {
    return true;
  }

  const normalizedSearch = search.trim().toLowerCase();
  const searchHaystack = [
    profile.businessName,
    profile.description,
    profile.locationCity,
    profile.locationState,
    ...profile.fabricTypes,
  ]
    .join(' ')
    .toLowerCase();

  return searchHaystack.includes(normalizedSearch);
};

const sortProfiles = (
  profiles: ProducerProfileWithUser[],
  sortBy: MarketplaceSearchInput['sortBy'],
) => {
  const items = [...profiles];

  items.sort((left, right) => {
    if (sortBy === 'businessName') {
      return left.businessName.localeCompare(right.businessName);
    }

    if (sortBy === 'rating') {
      if (right.ratingAverage !== left.ratingAverage) {
        return right.ratingAverage - left.ratingAverage;
      }

      if (right.ratingCount !== left.ratingCount) {
        return right.ratingCount - left.ratingCount;
      }
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });

  return items;
};

const buildBaseWhere = (filters: MarketplaceSearchInput): Prisma.ProducerProfileWhereInput => {
  const andConditions: Prisma.ProducerProfileWhereInput[] = [];

  if (filters.locationState) {
    andConditions.push({
      locationState: filters.locationState,
    });
  }

  if (filters.locationCity) {
    andConditions.push({
      locationCity: {
        contains: filters.locationCity,
        mode: 'insensitive',
      },
    });
  }

  if (filters.deliveryAvailable !== undefined) {
    andConditions.push({
      deliveryAvailable: filters.deliveryAvailable,
    });
  }

  if (filters.minPrice !== undefined) {
    andConditions.push({
      OR: [
        {
          priceRangeMax: {
            gte: filters.minPrice,
          },
        },
        {
          priceRangeMax: null,
        },
      ],
    });
  }

  if (filters.maxPrice !== undefined) {
    andConditions.push({
      OR: [
        {
          priceRangeMin: {
            lte: filters.maxPrice,
          },
        },
        {
          priceRangeMin: null,
        },
      ],
    });
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
};

const buildOrderBy = (
  sortBy: MarketplaceSearchInput['sortBy'],
): Prisma.ProducerProfileOrderByWithRelationInput[] => {
  if (sortBy === 'businessName') {
    return [{ businessName: 'asc' }, { createdAt: 'desc' }];
  }

  if (sortBy === 'rating') {
    return [{ ratingAverage: 'desc' }, { ratingCount: 'desc' }, { createdAt: 'desc' }];
  }

  return [{ createdAt: 'desc' }];
};

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});

export const marketplaceService = {
  async searchProducers(filters: MarketplaceSearchInput) {
    const where = buildBaseWhere(filters);
    const skip = (filters.page - 1) * filters.limit;
    const requiresInMemoryFiltering = Boolean(filters.search || filters.fabricType);

    if (!requiresInMemoryFiltering) {
      const [profiles, total] = await producersRepository.searchPaginated(
        where,
        buildOrderBy(filters.sortBy),
        skip,
        filters.limit,
      );

      return {
        items: profiles.map(toProducerProfileResponse),
        pagination: buildPagination(filters.page, filters.limit, total),
      };
    }

    const profiles = await producersRepository.findMany(where);
    const filteredProfiles = sortProfiles(
      profiles.filter(
        (profile) =>
          matchesFabricType(profile, filters.fabricType) &&
          matchesSearchText(profile, filters.search),
      ),
      filters.sortBy,
    );
    const paginatedProfiles = filteredProfiles.slice(skip, skip + filters.limit);

    return {
      items: paginatedProfiles.map(toProducerProfileResponse),
      pagination: buildPagination(filters.page, filters.limit, filteredProfiles.length),
    };
  },
};
