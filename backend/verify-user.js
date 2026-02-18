require('dotenv').config();
const prisma = require('./prisma/src/config/db');

async function verify() {
    console.log("---------------------------------------------------");
    console.log("🛠  VERIFICATION TOOL");
    console.log("---------------------------------------------------");

    const dbUrl = process.env.DATABASE_URL || "UNDEFINED";
    console.log("ENV DATABASE_URL:", dbUrl.replace(/:[^:@]+@/, ':***@'));

    try {
        const user = await prisma.user.findUnique({
            where: { email: 'Ragav@gmail.com' }
        });

        if (user) {
            console.log("✅ User found in App DB:", user);
        } else {
            console.log("❌ User NOT found using App configuration.");

            const count = await prisma.user.count();
            console.log(`Total users in DB: ${count}`);

            const allUsers = await prisma.user.findMany({
                select: { id: true, email: true, role: true }
            });
            console.log("Existing users:", allUsers);
        }
    } catch (e) {
        console.error("🔥 Error querying DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
