const prisma = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async ({ name, email, password, role }) => {
    // 1. Validate Role
    const validRoles = ["OWNER", "ADMIN", "STAFF", "VIEWER"];
    if (!role || !validRoles.includes(role)) {
        throw { status: 400, message: `Invalid role. Allowed roles: ${validRoles.join(", ")}` };
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw { status: 400, message: "Email already exists" };
    }

    const hash = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
        data: { name: `${name}'s Company` }
    });

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hash,
            role: role,
            companyId: company.id
        }
    });

    const token = jwt.sign(
        { userId: user.id, companyId: company.id, role: user.role, plan: company.plan },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { Status: 200, Message: `${user.role} registered successfully` };
};

exports.login = async ({ email, password }) => {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser) {
        throw { status: 400, message: "Email does not exist, Please register" };
    }

    const hash = await bcrypt.compare(password, existingUser.password);

    if (!hash) {
        throw { status: 400, message: "Incorrect password" };
    }

    const company = await prisma.company.findUnique({
        where: { id: existingUser.companyId }
    });

    const token = jwt.sign(
        { userId: existingUser.id, companyId: existingUser.companyId, role: existingUser.role, plan: company.plan },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, userId: existingUser.id, companyId: existingUser.companyId, role: existingUser.role, plan: company.plan };
};
