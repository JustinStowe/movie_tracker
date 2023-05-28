import { NextApiRequest, NextApiResponse } from "next";
import jwt, { VerifyCallback, Secret } from "jsonwebtoken";

interface ExtendedNextApiRequest extends NextApiRequest {
  user: any;
  exp: Date | null;
}

const authenticate = (
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: Function
): void => {
  let token: string | undefined =
    req.headers.authorization || String(req.query.token);
  if (token) {
    token = token.replace("Bearer", "");
    jwt.verify(
      token,
      process.env.SECRET as Secret,
      (err: any, decoded: any) => {
        req.user = err ? null : decoded.user;
        req.exp = err ? null : new Date(decoded.exp * 1000);
      }
    );
    return next();
  } else {
    req.user = null;
    return next();
  }
};

export default authenticate;
