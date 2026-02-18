const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const create = async (data) => {
    return await prisma.savingsDeposit.create({
        data: {
            principal: data.principal,
            interestRate: data.interestRate || 12.0,
            durationMonths: data.durationMonths,
            interestAmount: data.interestAmount,
            totalAmount: data.totalAmount,
            userId: data.userId,
            companyId: data.companyId,
        },
    });
};

const listAll = async (companyId) => {
    return await prisma.savingsDeposit.findMany({
        where: { companyId },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

const updateStatus = async (id, status) => {
    return await prisma.savingsDeposit.update({
        where: { id: parseInt(id) },
        data: { status },
    });
};

const getById = async (id) => {
    return await prisma.savingsDeposit.findUnique({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    create,
    listAll,
    updateStatus,
    getById
};
