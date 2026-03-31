exsisting:
import { verifyToken } from "@/lib/auth/jwt";

export function authenticate(req) {

  const token = req.headers.get("authorization");

  if (!token) throw new Error("Unauthorized");

  return verifyToken(token);

}

now given :

import { Request, Response, NextFunction } from "express"

export function authMiddleware(

  req: Request,
  res: Response,
  next: NextFunction

) {

  // JWT verification will be added later

  next()

}