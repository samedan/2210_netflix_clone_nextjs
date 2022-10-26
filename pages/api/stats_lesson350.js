import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    console.log("cookies /api/stats");
    console.log({ cookies: req.cookies });
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(403).send({}); // Forbidden
      } else {
        const { videoId, favourited, watched = true } = req.body;
        if (videoId) {
          const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET_HASURA_GRAPHQL_JWT_SECRET
          );
          // console.log({ decoded });
          const userId = decodedToken.issuer;
          // const videoId = "4zH5iYM4wJo";

          const doesStatsOnVideoExist = await findVideoIdByUser(
            token,
            userId,
            videoId
          );
          if (doesStatsOnVideoExist) {
            // UPDATE STATS the UserId with new VideoId
            const response = await updateStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({ data: response });
          } else {
            // POST STATS Add the video to UserId
            const response = await insertStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({ data: response });
          }
          res.send({ msg: "it works", decodedToken, findVideoId });
        }
      }
    } catch (error) {
      console.error("Error occured api/stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
