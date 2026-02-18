const prisma = require("../../config/db");

exports.create = (data, companyId) =>
    prisma.recurringTransaction.create({
        data: {
            ...data,
            startDate: new Date(data.startDate || new Date()),
            nextDueDate: new Date(data.nextDueDate),
            totalAmount: data.totalAmount ? parseFloat(data.totalAmount) : null,
            paidAmount: data.paidAmount ? parseFloat(data.paidAmount) : null,
            companyId
        }
    });

exports.list = (companyId) =>
    prisma.recurringTransaction.findMany({
        where: { companyId },
        orderBy: { nextDueDate: "asc" }
    });

exports.update = (id, data) =>
    prisma.recurringTransaction.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : undefined
        }
    });

exports.delete = (id) => prisma.recurringTransaction.delete({ where: { id: parseInt(id) } });

exports.detectSubscriptions = async (companyId) => {
    // Basic detection logic: find expenses with same category and amount occurring frequently
    const expenses = await prisma.expense.findMany({
        where: { companyId },
        orderBy: { date: 'desc' },
        take: 100
    });

    const frequencyMap = {};
    expenses.forEach(exp => {
        const key = `${exp.category}-${exp.amount}`;
        if (!frequencyMap[key]) frequencyMap[key] = [];
        frequencyMap[key].push(exp);
    });

    const suggestions = Object.keys(frequencyMap)
        .filter(key => frequencyMap[key].length >= 2) // At least 2 occurrences
        .map(key => {
            const items = frequencyMap[key];
            return {
                category: items[0].category,
                amount: items[0].amount,
                count: items.length,
                lastDate: items[0].date
            };
        });

    return suggestions;
};
