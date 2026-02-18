const service = require("./service");

exports.getSummary = async (req, res) => {
    try {
        const result = await service.getSummary(req.user.companyId);
        res.json({ data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportPDF = async (req, res) => {
    try {
        const { buffer, filename } = await service.exportPDF(req.user.companyId);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportExcel = async (req, res) => {
    try {
        const { buffer, filename } = await service.exportExcel(req.user.companyId);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportGSTSummary = async (req, res) => {
    try {
        const result = await service.getGSTSummary(req.user.companyId);
        res.json({ data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
