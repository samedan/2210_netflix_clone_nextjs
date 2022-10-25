import { magicAdmin } from "../../lib/magic-server";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";
      //invoke magic
      console.log("didToken on api/login.js");
      console.log({ didToken });
      // data coming from Magic
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log("metadata.issuer on api/login.js");
      console.log(metadata.issuer);

      // create jwt with JWT
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000 - 1 * 60 * 60), // avoids error with JWT issued in the future
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60), // 7 days
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.JWT_SECRET_HASURA_GRAPHQL_JWT_SECRET
      );
      console.log("token from awt api/login.js");
      console.log({ token });

      // check if user exists
      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      isNewUserQuery && (await createNewUser(token, metadata));
      // set the COOKIE
      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (error) {
      console.error("Something went wrong logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
