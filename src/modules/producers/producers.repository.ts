import { Prisma, type ProducerProfile } from '@prisma/client';

import { prisma } from '../../db/prisma';

export const producerProfileWithUserInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
    },
  },
} satisfies Prisma.ProducerProfileInclude;

export type ProducerProfileWithUser = Prisma.ProducerProfileGetPayload<{
  include: typeof producerProfileWithUserInclude;
}>;

export const producersRepository = {
  findById(id: string) {
    return prisma.producerProfile.findUnique({
      where: { id },
      include: producerProfileWithUserInclude,
    });
  },

  findByUserId(userId: string) {
    return prisma.producerProfile.findUnique({
      where: { userId },
      include: producerProfileWithUserInclude,
    });
  },

  updateByUserId(userId: string, data: Prisma.ProducerProfileUpdateInput) {
    return prisma.producerProfile.update({
      where: { userId },
      data,
      include: producerProfileWithUserInclude,
    });
  },

  count(where: Prisma.ProducerProfileWhereInput) {
    return prisma.producerProfile.count({ where });
  },

  findMany(
    where: Prisma.ProducerProfileWhereInput,
    options: Omit<Prisma.ProducerProfileFindManyArgs, 'where' | 'include' | 'select'> = {},
  ) {
    return prisma.producerProfile.findMany({
      where,
      include: producerProfileWithUserInclude,
      ...options,
    }) as Promise<ProducerProfileWithUser[]>;
  },

  searchPaginated(
    where: Prisma.ProducerProfileWhereInput,
    orderBy: Prisma.ProducerProfileOrderByWithRelationInput[],
    skip: number,
    take: number,
  ) {
    return prisma.$transaction([
      prisma.producerProfile.findMany({
        where,
        include: producerProfileWithUserInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.producerProfile.count({ where }),
    ]) as Promise<[ProducerProfileWithUser[], number]>;
  },

  toNullableNumber(value: ProducerProfile['priceRangeMin'] | ProducerProfile['priceRangeMax']) {
    return value === null ? null : Number(value.toString());
  },
};
