import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken?.issuer;
    return userId;
  }

  console.log("No token to verify on /lib/utils.js");
  return null;
}
