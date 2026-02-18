const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    console.log("---------------------------------------------------");
    console.log("🌱  SEED SCRIPT DEBUG");
    console.log("---------------------------------------------------");
    console.log("ENV DATABASE_URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@') : "UNDEFINED");

    // Check what users exist in THIS view of the DB
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    console.log("Users visible to seed script:", allUsers);

    const email = 'Ragav@gmail.com'
    const password = 'Ragav@123' // Updated to match user request
    const name = 'Ragav'

    const hashedPassword = await bcrypt.hash(password, 10)

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (!existingUser) {
        // Create new companty and user
        const company = await prisma.company.create({
            data: {
                name: `${name}'s Company`,
                plan: 'FREE',
            },
        })

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'OWNER',
                companyId: company.id,
            },
        })
        console.log(`Created user: ${user.email}`)
    } else {
        // Update existing user to ensure password is correct
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'OWNER' // Enforce OWNER role
            }
        })
        console.log(`Updated user: ${email} with new credentials`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
