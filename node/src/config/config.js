const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS,
        database: process.env.DB_NAME || "pesas_app",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres"
    },
    test: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASS || null,
        database: process.env.DB_NAME || "database_test",
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres"
    },
    production: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS,
        database: process.env.DB_NAME || "pesas_app",
        host: process.env.DB_HOST || "db",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres"
    }
}

module.exports = dbConfig;