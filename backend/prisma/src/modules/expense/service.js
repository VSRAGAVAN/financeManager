const prisma = require("../../config/db");

exports.create = (data, companyId) =>
    prisma.expense.create({
        data: {
            ...data,
            date: new Date(data.date),
            companyId
        }
    });

exports.list = (companyId) =>
    prisma.expense.findMany({
        where: { companyId },
        orderBy: { date: "desc" }
    });

exports.update = (id, data) =>
    prisma.expense.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined
        }
    });

exports.delete = (id) => prisma.expense.delete({ where: { id: parseInt(id) } });
