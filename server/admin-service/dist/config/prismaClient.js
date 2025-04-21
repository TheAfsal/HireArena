"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma
    .$connect()
    .then(() => console.log("Postgres connected successfully!"))
    .catch((error) => {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
});
exports.default = prisma;
