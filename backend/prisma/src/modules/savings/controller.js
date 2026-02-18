const service = require("./service");

const create = async (req, res) => {
    try {
        const { principal, interestRate, durationMonths, interestAmount, totalAmount } = req.body;
        const deposit = await service.create({
            principal,
            interestRate,
            durationMonths,
            interestAmount,
            totalAmount,
            userId: req.user.userId,
            companyId: req.user.companyId,
        });
        res.status(201).json(deposit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const list = async (req, res) => {
    try {
        const deposits = await service.listAll(req.user.companyId);
        res.json(deposits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if exists
        const existing = await service.getById(id);
        if (!existing) return res.status(404).json({ error: "Deposit not found" });

        const updated = await service.updateStatus(id, status);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    create,
    list,
    updateStatus,
};
