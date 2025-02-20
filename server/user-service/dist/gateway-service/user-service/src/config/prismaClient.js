"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma
    .$connect()
    .then(() => console.log("Postgres connected successfully!"))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error) => {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
});
exports.default = prisma;
