require("dotenv").config();
const mariadb = require("mariadb");

async function testRawConnection() {
    console.log("Testing MariaDB driver with exact same config as app...\n");

    const config = {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "Admin@123",
        database: process.env.DB_NAME || "finance_manager",
        port: parseInt(process.env.DB_PORT || "3306")
    };

    console.log("Config:", {
        ...config,
        password: "***"
    });

    let conn;
    try {
        console.log("\n1. Testing pool connection...");
        const pool = mariadb.createPool({ ...config, connectionLimit: 5 });
        conn = await pool.getConnection();
        console.log("✓ Pool connection successful!");

        const result = await conn.query("SELECT 1 as test");
        console.log("✓ Query successful:", result);

        conn.release();
        await pool.end();

    } catch (err) {
        console.error("\n✗ Connection failed!");
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
        console.error("\nFull error:", err);
    }

    try {
        console.log("\n2. Testing direct connection (no pool)...");
        conn = await mariadb.createConnection(config);
        console.log("✓ Direct connection successful!");

        const result = await conn.query("SELECT DATABASE() as db, USER() as user");
        console.log("✓ Query result:", result);

        await conn.end();

    } catch (err) {
        console.error("\n✗ Direct connection failed!");
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
    }

    process.exit(0);
}

testRawConnection();
