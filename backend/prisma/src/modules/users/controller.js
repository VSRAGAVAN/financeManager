const service = require("./service");

exports.list = async (req, res) => {
    try {
        const result = await service.getAllUsers();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

exports.delete = async (req, res) => {
    try {
        await service.deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};
