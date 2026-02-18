const service = require("./service");

exports.create = async (req, res) => {
    const income = await service.create(req.body, req.user.companyId);
    res.json({ data: income });
};

exports.list = async (req, res) => {
    const incomes = await service.list(req.user.companyId);
    if (!incomes) {
        throw { status: 404, message: "Incomes not found" };
    }
    res.json({ data: incomes });
};

exports.update = async (req, res) => {
    const income = await service.update(req.params.id, req.body);
    res.json({ data: income });
};

exports.delete = async (req, res) => {
    const income = await service.delete(req.params.id);
    res.json({ data: income });
};

