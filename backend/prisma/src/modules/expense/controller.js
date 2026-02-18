const service = require("./service");

exports.create = async (req, res) => {
    const expense = await service.create(req.body, req.user.companyId);
    res.json({ data: expense });
};

exports.list = async (req, res) => {
    const expenses = await service.list(req.user.companyId);
    res.json({ data: expenses });
};

exports.update = async (req, res) => {
    const expense = await service.update(req.params.id, req.body);
    res.json({ data: expense });
};

exports.delete = async (req, res) => {
    const expense = await service.delete(req.params.id);
    res.json({ data: expense });
};
