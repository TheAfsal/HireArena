import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { logger } from '../app';

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
      requestId?:string
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
    // logger.warn('Authorization header missing or malformed', {
    //   requestId: req.requestId,
    //   method: req.method,
    //   path: req.path,
    //   ip: req.ip,
    // });
    res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        // logger.error('Invalid or expired token', {
        //   requestId: req.requestId,
        //   method: req.method,
        //   path: req.path,
        //   ip: req.ip,
        //   error: err.message,
        // });
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      if (decoded && typeof decoded === "object") {
        req.user = decoded as IUser;
        // logger.info('Token validated successfully', {
        //   requestId: req.requestId,
        //   method: req.method,
        //   path: req.path,
        //   status: null,
        //   duration: 0,
        //   ip: req.ip,
        //   userId: req.user.userId,
        // });
      } else {
        return res.status(403).json({ error: "Invalid token structure" });
      }

      next();
    }
  );
};
