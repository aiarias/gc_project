import { defineConfig } from "drizzle-kit";

// This is the configuration for the Drizzle CLI
export default defineConfig({
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.DATABASE_URL as string, // This is the URL to your database and as String is a type assertion
    },
})