import "dotenv/config";

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

const sampleProducers = [
  {
    fullName: "Kemi Adebayo",
    email: "kemi@lagostextiles.ng",
    phoneNumber: "+2348030000001",
    businessName: "Lagos Luxe Fabrics",
    description:
      "Premium Ankara, lace, and chiffon supplier serving bridal and ready-to-wear designers across Lagos.",
    locationState: "Lagos",
    locationCity: "Lagos",
    address: "12 Balogun Market Road, Lagos Island, Lagos",
    fabricTypes: ["Ankara", "Lace", "Chiffon"],
    priceRangeMin: 4500,
    priceRangeMax: 18500,
    minimumOrderQuantity: 10,
    deliveryAvailable: true,
    whatsappNumber: "+2348030000001",
    profileImageUrl: "https://example.com/images/lagos-luxe-fabrics.jpg",
    isVerified: true,
    ratingAverage: 4.8,
    ratingCount: 124,
  },
  {
    fullName: "Sani Yusuf",
    email: "sani@arewathreads.ng",
    phoneNumber: "+2348030000002",
    businessName: "Arewa Thread Works",
    description:
      "Northern textile producer focused on guinea brocade, cotton blends, and uniform-grade materials.",
    locationState: "Federal Capital Territory",
    locationCity: "Abuja",
    address: "34 Aminu Kano Crescent, Wuse 2, Abuja",
    fabricTypes: ["Guinea Brocade", "Cotton", "Uniform Fabric"],
    priceRangeMin: 6000,
    priceRangeMax: 22000,
    minimumOrderQuantity: 15,
    deliveryAvailable: true,
    whatsappNumber: "+2348030000002",
    profileImageUrl: "https://example.com/images/arewa-thread-works.jpg",
    isVerified: true,
    ratingAverage: 4.6,
    ratingCount: 83,
  },
  {
    fullName: "Aisha Bello",
    email: "aisha@kanolooms.ng",
    phoneNumber: "+2348030000003",
    businessName: "Kano Looms",
    description:
      "Bulk-friendly supplier of adire-inspired prints, cotton, and durable fabrics for uniform and casual wear.",
    locationState: "Kano",
    locationCity: "Kano",
    address: "7 Bompai Industrial Layout, Kano",
    fabricTypes: ["Cotton", "Adire", "Plain Fabric"],
    priceRangeMin: 3000,
    priceRangeMax: 14000,
    minimumOrderQuantity: 25,
    deliveryAvailable: false,
    whatsappNumber: "+2348030000003",
    profileImageUrl: "https://example.com/images/kano-looms.jpg",
    isVerified: false,
    ratingAverage: 4.2,
    ratingCount: 41,
  },
  {
    fullName: "Tunde Adeyemi",
    email: "tunde@ibadanwoven.ng",
    phoneNumber: "+2348030000004",
    businessName: "Ibadan Woven House",
    description:
      "Traditional and modern woven fabric supplier with strong stock of aso oke, damask, and lining materials.",
    locationState: "Oyo",
    locationCity: "Ibadan",
    address: "19 Dugbe Market Close, Ibadan, Oyo",
    fabricTypes: ["Aso Oke", "Damask", "Lining"],
    priceRangeMin: 5000,
    priceRangeMax: 26000,
    minimumOrderQuantity: 8,
    deliveryAvailable: true,
    whatsappNumber: "+2348030000004",
    profileImageUrl: "https://example.com/images/ibadan-woven-house.jpg",
    isVerified: true,
    ratingAverage: 4.9,
    ratingCount: 152,
  },
  {
    fullName: "Chioma Nwankwo",
    email: "chioma@riverscloth.ng",
    phoneNumber: "+2348030000005",
    businessName: "Rivers Cloth Depot",
    description:
      "Port Harcourt supplier with strong inventory of lace, crepe, silk blends, and occasion fabrics.",
    locationState: "Rivers",
    locationCity: "Port Harcourt",
    address: "52 Aba Road, Port Harcourt, Rivers",
    fabricTypes: ["Lace", "Crepe", "Silk"],
    priceRangeMin: 7000,
    priceRangeMax: 24500,
    minimumOrderQuantity: 12,
    deliveryAvailable: true,
    whatsappNumber: "+2348030000005",
    profileImageUrl: "https://example.com/images/rivers-cloth-depot.jpg",
    isVerified: true,
    ratingAverage: 4.7,
    ratingCount: 96,
  },
  {
    fullName: "Uche Okafor",
    email: "uche@abafabrichub.ng",
    phoneNumber: "+2348030000006",
    businessName: "Aba Fabric Hub",
    description:
      "Fast-moving fabric wholesaler in Aba with strong volumes of cotton, linen, and tailoring essentials.",
    locationState: "Abia",
    locationCity: "Aba",
    address: "10 Ngwa Road, Aba, Abia",
    fabricTypes: ["Cotton", "Linen", "Tailoring Supplies"],
    priceRangeMin: 2800,
    priceRangeMax: 12000,
    minimumOrderQuantity: 20,
    deliveryAvailable: false,
    whatsappNumber: "+2348030000006",
    profileImageUrl: "https://example.com/images/aba-fabric-hub.jpg",
    isVerified: false,
    ratingAverage: 4.1,
    ratingCount: 29,
  },
];

const sampleDesigners = [
  {
    fullName: "Amaka Obi",
    email: "amaka@market-place.design",
    phoneNumber: "+2348031000001",
  },
];

async function main() {
  const sharedPasswordHash = await bcrypt.hash("Password123", saltRounds);

  for (const producer of sampleProducers) {
    const user = await prisma.user.upsert({
      where: { email: producer.email },
      update: {
        fullName: producer.fullName,
        phoneNumber: producer.phoneNumber,
        role: UserRole.PRODUCER,
        passwordHash: sharedPasswordHash,
      },
      create: {
        fullName: producer.fullName,
        email: producer.email,
        phoneNumber: producer.phoneNumber,
        role: UserRole.PRODUCER,
        passwordHash: sharedPasswordHash,
      },
    });

    await prisma.producerProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: producer.businessName,
        description: producer.description,
        locationState: producer.locationState,
        locationCity: producer.locationCity,
        address: producer.address,
        fabricTypes: producer.fabricTypes,
        priceRangeMin: producer.priceRangeMin,
        priceRangeMax: producer.priceRangeMax,
        minimumOrderQuantity: producer.minimumOrderQuantity,
        deliveryAvailable: producer.deliveryAvailable,
        whatsappNumber: producer.whatsappNumber,
        profileImageUrl: producer.profileImageUrl,
        isVerified: producer.isVerified,
        ratingAverage: producer.ratingAverage,
        ratingCount: producer.ratingCount,
      },
      create: {
        userId: user.id,
        businessName: producer.businessName,
        description: producer.description,
        locationState: producer.locationState,
        locationCity: producer.locationCity,
        address: producer.address,
        fabricTypes: producer.fabricTypes,
        priceRangeMin: producer.priceRangeMin,
        priceRangeMax: producer.priceRangeMax,
        minimumOrderQuantity: producer.minimumOrderQuantity,
        deliveryAvailable: producer.deliveryAvailable,
        whatsappNumber: producer.whatsappNumber,
        profileImageUrl: producer.profileImageUrl,
        isVerified: producer.isVerified,
        ratingAverage: producer.ratingAverage,
        ratingCount: producer.ratingCount,
      },
    });
  }

  for (const designer of sampleDesigners) {
    await prisma.user.upsert({
      where: { email: designer.email },
      update: {
        fullName: designer.fullName,
        phoneNumber: designer.phoneNumber,
        role: UserRole.DESIGNER,
        passwordHash: sharedPasswordHash,
      },
      create: {
        fullName: designer.fullName,
        email: designer.email,
        phoneNumber: designer.phoneNumber,
        role: UserRole.DESIGNER,
        passwordHash: sharedPasswordHash,
      },
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
