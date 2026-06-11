const { PrismaClient } = require('@prisma/client');

test('Prisma client can be instantiated', async () => {
  const prisma = new PrismaClient();
  expect(prisma).toBeDefined();
});
