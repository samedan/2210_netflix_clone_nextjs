const { Magic } = require("@magic-sdk/admin");

export const magicAdmin = new Magic(process.env.MAGIC_SERVER_KEY);

// mAdmin.token;
// mAdmin.token.getIssuer;
// mAdmin.token.getPublicAddress;
// mAdmin.token.decode;
// mAdmin.token.validate;
