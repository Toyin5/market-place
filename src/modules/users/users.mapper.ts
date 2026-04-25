import { toEmbeddedProducerProfile } from '../producers/producers.mapper';
import type { UserWithProducerProfile } from './users.repository';

export const toUserResponse = (user: UserWithProducerProfile) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  producerProfile: user.producerProfile ? toEmbeddedProducerProfile(user.producerProfile) : null,
});
