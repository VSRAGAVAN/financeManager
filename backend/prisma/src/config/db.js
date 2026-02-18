const { PrismaClient } = require("@prisma/client");

console.log("🔍 Database Configuration:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@') : "NOT SET");

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn']
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = prisma;
