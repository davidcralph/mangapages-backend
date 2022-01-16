const data = require('../data.json');
const dataLightNovel = require('../dataLightNovel.json');
const rateLimit = require('../struct/ratelimiter');

module.exports = async (req, res) => {
  try {
    await rateLimit(100, req.headers['x-real-ip']);
  } catch (error) {
    return res.status(429).send({
      message: 'Too many requests',
    });
  }

  let use = data;
  if (req.query.type === 'lightnovel') {
    use = dataLightNovel;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).send(use.sort(() => Math.random() - 0.5).slice(-4));
};
