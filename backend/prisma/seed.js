require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Remove old products first
  await prisma.product.deleteMany();

  const result = await prisma.product.createMany({
    data: [
      {
        name: "RTX 5070 Graphics Card",
        price: 649.99,
        stock: 12,
        category: "Graphics Cards",
        description:
          "The NVIDIA RTX 5070 delivers high-performance gaming with ray tracing, DLSS support, and excellent 1440p and 4K performance.",
        image:
          "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
      },
      {
        name: "Mechanical RGB Keyboard",
        price: 119.99,
        stock: 30,
        category: "Keyboards",
        description:
          "A durable mechanical gaming keyboard with customizable RGB lighting, tactile switches, and anti-ghosting technology.",
        image:
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
      },
      {
        name: "Gaming Headset",
        price: 89.99,
        stock: 18,
        category: "Audio",
        description:
          "Immersive surround sound gaming headset featuring a noise-canceling microphone and memory foam ear cushions.",
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
      },
      {
        name: "Gaming Mouse",
        price: 59.99,
        stock: 40,
        category: "Accessories",
        description:
          "High-precision gaming mouse with adjustable DPI, programmable buttons, and customizable RGB lighting.",
        image:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
      },
    ],
  });

  console.log(`✅ Seeded ${result.count} products`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });