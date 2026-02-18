const service = require("./service");

exports.create = async (req, res) => {
    const recurring = await service.create(req.body, req.user.companyId);
    res.json({ data: recurring });
};

exports.list = async (req, res) => {
    const recurring = await service.list(req.user.companyId);
    res.json({ data: recurring });
};

exports.update = async (req, res) => {
    const recurring = await service.update(req.params.id, req.body);
    res.json({ data: recurring });
};

exports.delete = async (req, res) => {
    const recurring = await service.delete(req.params.id);
    res.json({ data: recurring });
};

exports.getSuggestions = async (req, res) => {
    const suggestions = await service.detectSubscriptions(req.user.companyId);
    res.json({ data: suggestions });
};
