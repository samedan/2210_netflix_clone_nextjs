import { verifyToken } from "../lib/utils";

const useRedirectUser = async (context) => {
  const token = context.req ? context.req?.cookies.token : null;

  // Blocks app without Authentification
  const userId = await verifyToken(token);
  // const userId = null;

  return {
    userId,
    token,
  };
};

export default useRedirectUser;
