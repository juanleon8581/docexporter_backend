import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "@/config/adapters/jwt.adapter";
import envs from "@/config/envs";

interface DecodedToken {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export class AuthMiddleware {
  static validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    if (!authorization) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid Bearer token format" });
      return;
    }

    const token = authorization.split(" ").at(1) || "";

    JwtAdapter.validateToken<DecodedToken>(token, envs.JWT_SECRET)
      .then((payload) => {
        if (!payload) {
          res.status(401).json({ error: "Invalid or expired token" });
          return;
        }

        req.user = payload;
        next();
      })
      .catch((error) => {
        res.status(500).json({ error, errorMsg: "Internal server error" });
        return;
      });
  }
}
