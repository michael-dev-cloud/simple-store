// Prisma Client Singleton
// Using require from @prisma/client which is properly set up
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Reuse connection in development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error'],
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
