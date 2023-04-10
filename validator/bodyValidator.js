function checkBodyParams(req, res, next) {
    const body = req.body;
  
    for (const param in body) {
      if (!body[param]) {
        return res.status(400).send(`Missing value for ${param}`);
      }
    }
  
    next();
}

module.exports = {checkBodyParams};