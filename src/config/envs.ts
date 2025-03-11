import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Define environment schema with Zod
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "qa"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  DATABASE_PASSWORD: z.string(),
  DATABASE_URL: z.string().url({ message: "Must be a valid URL" }),
  DIRECT_URL: z.string().url({ message: "Must be a valid URL" }),
  JWT_SECRET: z.string().min(32, { message: "Must have almost 32 characters" }),
  SUPABASE_URL: z.string().url({ message: "Must be a valid URL" }),
  SUPABASE_KEY: z.string(),
  CRYPTO_SECRET: z
    .string()
    .length(64, { message: "Must be 64 hex characters (32 bytes)" }),
  CRYPTO_IV: z
    .string()
    .length(32, { message: "Must be 32 hex characters (16 bytes)" }),
});

// Type inference from the schema
type Env = z.infer<typeof envSchema>;

const loadEnv = (): Env => {
  // Determine the current environment
  const nodeEnv = process.env.NODE_ENV || "dev";

  // Load base .env file first (if exists)
  const baseEnvPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(baseEnvPath)) {
    dotenv.config({ path: baseEnvPath });
  }

  // Load environment-specific .env file (if exists)
  if (nodeEnv !== "prod") {
    const envFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
    if (fs.existsSync(envFilePath)) {
      dotenv.config({ path: envFilePath, override: true });
    }
  }

  try {
    // Validate environment variables against the schema
    const validatedEnvs = envSchema.parse(process.env);
    return validatedEnvs;
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Failed to validate environment variables");
  }
};

// Load and export the environment variables
const envs = loadEnv();

export default envs;
