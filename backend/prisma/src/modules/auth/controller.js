const service = require("./service");

exports.register = async (req, res) => {
    try {
        const result = await service.register(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await service.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    }
};
