const prisma = require("../../config/db");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

exports.getSummary = async (companyId) => {
    const incomes = await prisma.income.findMany({ where: { companyId } });
    const expenses = await prisma.expense.findMany({ where: { companyId } });

    const categoryBreakdown = expenses.reduce((acc, curr) => {
        const cat = curr.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + curr.amount;
        return acc;
    }, {});

    const monthlyTrends = {};
    [...incomes.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))].forEach(item => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyTrends[month]) monthlyTrends[month] = { income: 0, expense: 0 };
        monthlyTrends[month][item.type] += item.amount;
    });

    return {
        totalIncome: incomes.reduce((sum, i) => sum + i.amount, 0),
        totalExpense: expenses.reduce((sum, e) => sum + e.amount, 0),
        categoryBreakdown,
        monthlyTrends
    };
};

exports.getGSTSummary = async (companyId) => {
    const incomes = await prisma.income.findMany({
        where: { companyId, NOT: { gstAmount: null } }
    });
    const expenses = await prisma.expense.findMany({
        where: { companyId, NOT: { gstAmount: null } }
    });

    const summary = {
        collectedGST: incomes.reduce((sum, i) => sum + (i.gstAmount || 0), 0),
        paidGST: expenses.reduce((sum, e) => sum + (e.gstAmount || 0), 0),
        netGST: 0,
        breakdown: {
            income: incomes.map(i => ({ source: i.source, date: i.date, amount: i.amount, gstAmount: i.gstAmount, gstRate: i.gstRate })),
            expense: expenses.map(e => ({ category: e.category, date: e.date, amount: e.amount, gstAmount: e.gstAmount, gstRate: e.gstRate }))
        }
    };
    summary.netGST = summary.collectedGST - summary.paidGST;
    return summary;
};

exports.exportPDF = async (companyId) => {
    const summary = await this.getSummary(companyId);
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    return new Promise((resolve) => {
        doc.on('end', () => {
            const buffer = Buffer.concat(buffers);
            resolve({ buffer, filename: `Financial_Report_${Date.now()}.pdf` });
        });

        doc.fontSize(25).text('Financial Executive Summary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Total Income: ${summary.totalIncome.toFixed(2)}`);
        doc.text(`Total Expense: ${summary.totalExpense.toFixed(2)}`);
        doc.text(`Net Balance: ${(summary.totalIncome - summary.totalExpense).toFixed(2)}`);

        doc.moveDown();
        doc.fontSize(18).text('Expense category Breakdown');
        Object.entries(summary.categoryBreakdown).forEach(([cat, amt]) => {
            doc.fontSize(12).text(`${cat}: ${amt.toFixed(2)}`);
        });

        doc.end();
    });
};

exports.exportExcel = async (companyId) => {
    const incomes = await prisma.income.findMany({ where: { companyId } });
    const expenses = await prisma.expense.findMany({ where: { companyId } });

    const workbook = new ExcelJS.Workbook();
    const incSheet = workbook.addWorksheet('Incomes');
    incSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Source', key: 'source', width: 20 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'GST Amount', key: 'gstAmount', width: 15 }
    ];
    incomes.forEach(i => incSheet.addRow({ ...i, date: i.date.toISOString().split('T')[0] }));

    const expSheet = workbook.addWorksheet('Expenses');
    expSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'GST Amount', key: 'gstAmount', width: 15 }
    ];
    expenses.forEach(e => expSheet.addRow({ ...e, date: e.date.toISOString().split('T')[0] }));

    const buffer = await workbook.xlsx.writeBuffer();
    return { buffer, filename: `Financial_Data_${Date.now()}.xlsx` };
};
