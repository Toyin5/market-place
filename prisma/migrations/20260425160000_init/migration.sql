-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DESIGNER', 'PRODUCER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationState" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "fabricTypes" TEXT[],
    "priceRangeMin" DECIMAL(12,2),
    "priceRangeMax" DECIMAL(12,2),
    "minimumOrderQuantity" INTEGER NOT NULL,
    "deliveryAvailable" BOOLEAN NOT NULL DEFAULT false,
    "whatsappNumber" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "producer_profiles_userId_key" ON "producer_profiles"("userId");

-- CreateIndex
CREATE INDEX "producer_profiles_locationState_idx" ON "producer_profiles"("locationState");

-- CreateIndex
CREATE INDEX "producer_profiles_locationCity_idx" ON "producer_profiles"("locationCity");

-- CreateIndex
CREATE INDEX "producer_profiles_deliveryAvailable_idx" ON "producer_profiles"("deliveryAvailable");

-- CreateIndex
CREATE INDEX "producer_profiles_isVerified_idx" ON "producer_profiles"("isVerified");

-- CreateIndex
CREATE INDEX "producer_profiles_ratingAverage_idx" ON "producer_profiles"("ratingAverage");

-- AddForeignKey
ALTER TABLE "producer_profiles" ADD CONSTRAINT "producer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
