const { ErrorMiddleWare } = require("../../../class");


const checkVal = (fields, place) => {

  if(!Array.isArray(fields)) {
    return (req, res, next) => {
      throw new ErrorMiddleWare('Fields are not array')
    }
  }

  return (req, res, next) => {
    const checkData = req[place] ? req[place] : {};

    const notExistCheckingElements = fields.filter((item) => !checkData[item]);

    if (notExistCheckingElements.length > 0) {
      res.status(500).send({
        error: true,
        message: `not found '${notExistCheckingElements.join(",")}' in '${place}'`,
      });
      return;
    }
    next();
  };
};

module.exports = {checkVal}