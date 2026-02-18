require("dotenv").config();
const prisma = require("./src/config/db");

async function testPrismaConnection() {
    try {
        console.log("Testing Prisma connection...\n");

        // Test raw query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("✓ Prisma raw query successful:", result);

        // Test model query
        const companies = await prisma.company.findMany({ take: 1 });
        console.log("✓ Prisma model query successful. Companies found:", companies.length);

        console.log("\n✓ All Prisma tests passed!");

    } catch (err) {
        console.error("\n✗ Prisma connection failed!");
        console.error("Error:", err.message);
        console.error("\nFull error:", err);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

testPrismaConnection();
