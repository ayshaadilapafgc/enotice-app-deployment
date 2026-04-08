const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Seed Admin
  await prisma.user.create({
    data: {
      fullName: 'System Administrator',
      regNo: 'ADMIN-001',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Seed Teacher
  await prisma.user.create({
    data: {
      fullName: 'Professor Smith',
      regNo: 'THEO-101',
      password: hashedPassword,
      role: 'TEACHER',
    },
  });

  // Seed Student
  await prisma.user.create({
    data: {
      fullName: 'Jane Student',
      regNo: 'STU-2026',
      password: hashedPassword,
      role: 'STUDENT',
      marks: {
        create: [
          { subject: 'CompSci 1', score: 81, maxScore: 92 },
          { subject: 'Digital Ethics', score: 91, maxScore: 100 },
          { subject: 'Math', score: 92, maxScore: 92 }
        ]
      }
    },
  });

  console.log('Database Multi-role Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
