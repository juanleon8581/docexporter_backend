import * as crypto from "crypto";
import envs from "../envs";

const algorithm = "aes-256-cbc";
const key = Buffer.from(envs.CRYPTO_SECRET, "hex");
const iv = Buffer.from(envs.CRYPTO_IV, "hex");

export class CryptoAdapter {
  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  static decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
