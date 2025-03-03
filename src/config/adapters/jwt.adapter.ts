import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export class JwtAdapter {
  static async generateToken(
    payload: any,
    jwtSeed: string,
    duration: number | StringValue = "2h"
  ) {
    return new Promise((resolve) => {
      jwt.sign(payload, jwtSeed, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);

        resolve(token);
      });
    });
  }

  static validateToken<T>(token: string, jwtSeed: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, jwtSeed, (err, decoded) => {
        if (err) return resolve(null);

        resolve(decoded as T);
      });
    });
  }
}
