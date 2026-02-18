const prisma = require("../../config/db");

exports.create = (data, companyId) =>
    prisma.income.create({
        data: {
            ...data,
            date: new Date(data.date),
            companyId
        }
    });

exports.list = (companyId) =>
    prisma.income.findMany({
        where: { companyId },
        orderBy: { date: "desc" }
    });

exports.update = (id, data) =>
    prisma.income.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined
        }
    });

exports.delete = (id) => prisma.income.delete({ where: { id: parseInt(id) } });
