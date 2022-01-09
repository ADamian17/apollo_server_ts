import * as jwt from "jsonwebtoken";
import proccessEnv from "../utils/proccessEnv";

export interface AuthTokenPayload {
  userId: number
}

export const decodeAuthHeader = (authHeader: string): AuthTokenPayload => {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }

  return jwt.verify(token, proccessEnv.APP_SECRET) as AuthTokenPayload;
}