const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Seed the Root Admin (Verified by default)
  await prisma.user.create({
    data: {
      fullName: 'System Administrator',
      regNo: 'ADMIN-001',
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('Database Admin Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
