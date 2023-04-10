function checkQueryParams(req, res, next) {
    const query = req.query;
  
    for (const param in query) {
      if (!query[param]) {
        return res.status(400).send(`Missing value for ${param}`);
      }
    }
    return true
}

module.exports = checkQueryParams;