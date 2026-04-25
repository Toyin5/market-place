import { Prisma } from '@prisma/client';

import { prisma } from '../../db/prisma';

export const userWithProducerProfileInclude = {
  producerProfile: true,
} satisfies Prisma.UserInclude;

export type UserWithProducerProfile = Prisma.UserGetPayload<{
  include: typeof userWithProducerProfileInclude;
}>;

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: userWithProducerProfileInclude,
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: userWithProducerProfileInclude,
    });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: userWithProducerProfileInclude,
    });
  },
};
