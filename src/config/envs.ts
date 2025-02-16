import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "pord", "qa"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  DATABASE_PASS: z.string(),
  DATABASE_URL: z.string().url({ message: "Must be a valid URL" }),
  JWT_SECRET: z.string().min(32, { message: "Must have almost 32 characters" }),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
});

const getEnvs = () => {
  try {
    console.log(process.env);
    const envs = envSchema.parse(process.env);
    console.log(envs);
    return envs;
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Failed to validate environment variables");
  }
};
const envs = getEnvs();
export default envs;
