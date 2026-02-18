const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
};

exports.deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id: parseInt(id) },
    });
};
