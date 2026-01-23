import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    const user = await prisma.user.update({
      where: { email: 'mm@rekombination.de' },
      data: {
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });
    console.log('✓ User updated:', user.email);
    console.log('  - Role:', user.role);
    console.log('  - Email verified:', user.emailVerified);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('✗ User not found: mm@rekombination.de');
    } else {
      console.error('✗ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();
