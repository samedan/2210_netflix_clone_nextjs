import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";

export default async function stats(req, resp) {
  if (req.method === "POST") {
    try {
      const token = req.cookies.token;
      if (!token) {
        resp.status(403).send({});
      } else {
        const { videoId } = req.body;
        if (videoId) {
          const decodedToken = jwt.verify(
            token,
            process.env.NEXT_PUBLIC_JWT_SECRET
          );

          const userId = decodedToken.issuer;
          const findVideo = await findVideoIdByUser(token, userId, videoId);
          console.log({ findVideo });
          const doesStatsExist = findVideo?.length > 0;

          const { favourited, watched = true } = req.body;
          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            resp.send({ data: response });
          } else {
            // add it
            const response = await insertStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            resp.send({ data: response });
          }
        } else {
          resp.status(500).send({ msg: "videoId is required" });
        }
      }
    } catch (error) {
      console.error("Error occurred /stats", error);
      resp.status(500).send({ done: false, error: error?.message });
    }
  } else {
    console.log("Not POST Method");
    const token = req.cookies.token;
    if (!token) {
      console.log("No Token");
      resp.status(403).send({});
    } else {
      // const { videoId } = req.query;
      const { videoId } = req.body;
      // console.log({ videoId });
      // console.log({ token });
      // console.log(process.env.NEXT_PUBLIC_JWT_SECRET);
      if (videoId) {
        const decodedToken = jwt.verify(
          token,
          process.env.NEXT_PUBLIC_JWT_SECRET
        );
        console.log({ decodedToken });
        const userId = decodedToken.issuer;
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        console.log({ findVideo });
        const doesStatsExist = findVideo?.length > 0;
        if (doesStatsExist) {
          console.log("doesStatsExist false");
          resp.send(findVideo);
        } else {
          // add it
          resp.status(404);
          resp.send({ user: null, msg: "Video not found" });
        }
      }
    }
  }
}
