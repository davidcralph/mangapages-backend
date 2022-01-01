const config = require("../config.json");
const data = require("../data.json");
const dataLightNovel = require("../dataLightNovel.json");
const { matchSorter } = require("match-sorter");

const rateLimit = require("lambda-rate-limiter")({
  interval: config.ratelimit_time * 1000,
}).check;

module.exports = async (req, res) => {
  try {
    await rateLimit(500, req.headers["x-real-ip"]);
  } catch (error) {
    return res.status(429).send({
      message: "Too many requests",
    });
  }

  let use = data;
  if (req.query.type === "lightnovel") {
    use = dataLightNovel;
  }

  const mangaResults = req.query.input
    ? matchSorter(use, req.query.input, {
        keys: ["title", "site"],
        threshold: matchSorter.rankings.WORD_STARTS_WITH,
      })
    : {
        message: "Input query required",
      };

  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(mangaResults.slice(0, 300));
};
