const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Check if exists first to avoid crash if run twice
  const existing = await prisma.user.findUnique({ where: { regNo: 'BCA-1001' } });
  if (!existing) {
      await prisma.user.create({
        data: {
          fullName: 'Nihal Student',
          regNo: 'BCA-1001',
          password: hashedPassword,
        },
      });
      console.log('User created successfully.');
  } else {
      console.log('User already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
