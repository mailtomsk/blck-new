import { createHmac } from "node:crypto";
import jwt from "jsonwebtoken";

export function hashPassword(password: string): string {
  return createHmac("sha256", "silabuz-secret").update(password).digest("hex");
}

export function comparePassword(
  password: string,
  checkPassword: string
): boolean {
  return password === hashPassword(checkPassword);
}

export const generateToken = (uid: any) => {
  const expiresIn = "2 days";
  try {
      const token = jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn });

      return { token, expiresIn };

  } catch (error) {
      return error;
  }
}