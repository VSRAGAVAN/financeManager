require('dotenv').config();
const prisma = require('./prisma/src/config/db');

async function testWrite() {
    console.log("---------------------------------------------------");
    console.log("✍️  WRITE PERSISTENCE TEST");
    console.log("---------------------------------------------------");
    const email = `write_test_${Date.now()}@test.com`;

    try {
        console.log(`Attempting to create user: ${email}`);

        const company = await prisma.company.create({
            data: { name: "Test Write Company" }
        });

        const user = await prisma.user.create({
            data: {
                name: "Write Tester",
                email: email,
                password: "hash",
                role: "STAFF",
                companyId: company.id
            }
        });

        console.log("✅ User create returned:", user);

        const check = await prisma.user.findUnique({
            where: { email }
        });

        if (check) {
            console.log("✅ Immediate read verification successful:", check);
        } else {
            console.error("❌ Immediate read FAILED! Data not found.");
        }

    } catch (e) {
        console.error("🔥 Write test failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testWrite();
