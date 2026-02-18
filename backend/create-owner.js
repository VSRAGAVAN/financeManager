require('dotenv').config();
const prisma = require('./prisma/src/config/db');
const bcrypt = require('bcrypt');

async function createOwner() {
    console.log("---------------------------------------------------");
    console.log("👑  CREATE OWNER SCRIPT");
    console.log("---------------------------------------------------");
    console.log("ENV DATABASE_URL:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

    const email = 'Ragav@gmail.com';
    const password = 'Ragav@123';
    const name = 'Ragav';

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!existingUser) {
            console.log(`Creating new owner: ${email}`);

            const company = await prisma.company.create({
                data: {
                    name: `${name}'s Company`,
                    plan: 'FREE',
                },
            });

            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'OWNER',
                    companyId: company.id,
                },
            });
            console.log("✅ Created Owner:", user.email);
        } else {
            console.log(`Updating existing owner: ${email}`);

            const user = await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    role: 'OWNER'
                }
            });
            console.log("✅ Updated Owner:", user.email);
        }

    } catch (e) {
        console.error("🔥 Error creating owner:", e);
    } finally {
        await prisma.$disconnect();
    }
}

createOwner();
