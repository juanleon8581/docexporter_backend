import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "qa"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  DATABASE_PASSWORD: z.string(),
  DATABASE_URL: z.string().url({ message: "Must be a valid URL" }),
  DIRECT_URL: z.string().url({ message: "Must be a valid URL" }),
  JWT_SECRET: z.string().min(32, { message: "Must have almost 32 characters" }),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  CRYPTO_SECRET: z
    .string()
    .length(64, { message: "Must be 64 hex characters (32 bytes)" }),
  CRYPTO_IV: z
    .string()
    .length(32, { message: "Must be 32 hex characters (16 bytes)" }),
});

const loadEnv = () => {
  let envFilePath: string;
  let envVars: any;
  const nodeEnv = process.env.NODE_ENV ?? "dev";

  envVars = process.env;

  if (nodeEnv !== "prod") {
    envFilePath = `.env.${nodeEnv}`;
    envVars = require("dotenv").config({ path: envFilePath });
  }

  console.log("🚧 Debug log 🚧 ", envVars); // TODO: Remove this console.log

  try {
    const envs = envSchema.parse(envVars.parsed);
    return envs;
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Failed to validate environment variables");
  }
};

const envs = loadEnv();

export default envs;
