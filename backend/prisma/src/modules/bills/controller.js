const service = require("./service");

exports.create = async (req, res) => {
    const bill = await service.create(req.body, req.user.companyId);
    res.json({ data: bill });
};

exports.list = async (req, res) => {
    const bills = await service.list(req.user.companyId);
    res.json({ data: bills });
};

exports.update = async (req, res) => {
    const bill = await service.update(req.params.id, req.body);
    res.json({ data: bill });
};

exports.delete = async (req, res) => {
    const bill = await service.delete(req.params.id);
    res.json({ data: bill });
};

exports.getUpcoming = async (req, res) => {
    const bills = await service.getUpcoming(req.user.companyId);
    res.json({ data: bills });
};
