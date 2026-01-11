import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Created admin user:', admin);

  const defaultCategory = await prisma.category.upsert({
    where: {
      name_userId: {
        name: 'General',
        userId: admin.id
      }
    },
    update: {},
    create: {
      name: 'General',
      color: '#3B82F6',
      userId: admin.id,
    },
  });

  console.log('Created default category:', defaultCategory);

  const sampleLinks = [
    {
      title: 'Google',
      url: 'https://www.google.com',
      description: 'Search engine',
      userId: admin.id,
      categoryId: defaultCategory.id,
    },
    {
      title: 'GitHub',
      url: 'https://github.com',
      description: 'Code hosting platform',
      userId: admin.id,
      categoryId: defaultCategory.id,
      isFavorite: true,
    },
  ];

  for (const link of sampleLinks) {
    await prisma.link.create({ data: link });
  }

  console.log('Created sample links');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
