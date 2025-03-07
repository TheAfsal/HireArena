import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "colors";

interface IUser {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  status?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];

  console.log('====================================');
  console.log(token);
  console.log('====================================');
  
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        console.log(err);

        return res.status(403).json({ error: "Invalid or expired token" });
      }

      if (decoded && typeof decoded === "object") {
        console.log(decoded);
        
        req.user = decoded as IUser;
      } else {
        return res.status(403).json({ error: "Invalid token structure" });
      }

      next();
    }
  );
};
