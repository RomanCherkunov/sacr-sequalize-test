const { Op } = require("sequelize");
const { user } = require("../../db/models");
const { checkVal } = require("../utils");

const get = (req, res) => {
  const { search, limit, offset, id } = req.query;

  if (id) {
    user
      .findOne({ where: { id } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
    return;
  }

  const where = search ? { caption: { [Op.getLike()]: `%${search}%` } } : null;

  user
    .findAndCountAll({
      where,
      ...(limit ? { limit } : {}),
      ...(offset ? { offset } : {}),
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const post = async (req, res) => {
  console.log({ caption: req.body.caption, description: req.body.description });
  const createdUser = await user.create(req.body).then((data) => {
    res.send(data);
  });
};

const update = async (req, res) => {
  const { id, ...other } = req.body;
  user
    .update(req.body, { where: { id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};



module.exports = (router) => {
  router.get("/", get);
  router.post("/", post);
  router.put("/", checkVal(["id", "land"], "body"), update);

  return true;
};
