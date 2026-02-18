const prisma = require("../../config/db");

exports.create = (data, companyId) =>
    prisma.billReminder.create({
        data: {
            ...data,
            dueDate: new Date(data.dueDate),
            companyId
        }
    });

exports.list = (companyId) =>
    prisma.billReminder.findMany({
        where: { companyId },
        orderBy: { dueDate: "asc" }
    });

exports.update = (id, data) =>
    prisma.billReminder.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        }
    });

exports.delete = (id) => prisma.billReminder.delete({ where: { id: parseInt(id) } });

exports.getUpcoming = (companyId) =>
    prisma.billReminder.findMany({
        where: {
            companyId,
            isPaid: false,
            dueDate: {
                gte: new Date(),
                lte: new Date(new Date().setDate(new Date().getDate() + 7)) // Next 7 days
            }
        },
        orderBy: { dueDate: "asc" }
    });
