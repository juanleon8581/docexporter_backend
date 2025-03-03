import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "@/config/jwt.adapter";
import envs from "@/config/envs";

interface DecodedToken {
  id: string;
  email: string;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await JwtAdapter.validateToken<DecodedToken>(
      token,
      envs.JWT_SECRET
    );

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
