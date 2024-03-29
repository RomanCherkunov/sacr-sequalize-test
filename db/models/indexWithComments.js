const path = require("path");
const Sequelize = require("sequelize");
const config = require("../../config/config.json");
const file = require("file");
const db = {};

const basename = path.basename(__filename); // получаем имя файла скрипта(index.js)

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    config.development
  );
  // в данном случае выполняется условие else
} else {
  // создаем новый экземпляр секвалайза с параметрами описанными в конфиге
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    config.development
  );
}

// Обьявляем константу для использования софт делита во всех моделях
const defOptions = { paranoid: true };

let findFile = []; //Массив для путей к файлам моделей

// функция для замены первого символа в верхний регистр
function capitalizeFirstLetter(string) {
  if (string === "index") {
    return "";
  }
  return string[0].toUpperCase() + string.slice(1);
}

file.walkSync(__dirname, (dir, dirs, files) => {
  // ищем файлы и папки в models
  files // // фильтруем найденные файлы таким образом чтобы в массиве остались только файлы  которые не равны basename(index.js) и у которых есть расширение .js
    .filter((item) => {
      return (
        // если найденный файл не равен basename(файл скрипта, обычно index.js), или
        (item !== basename || dir.replace(__dirname, "") !== "") &&
        item.slice(-3) === ".js"
      );
    }) // добавляем имя каждого файла к пути до папки и  пушим каждый элемент  в массив findFile
    .forEach((item) => {
      findFile.push(path.join(dir, item));
    });
});

const loaderFile = [];

findFile.forEach((item) => {
  const extension = path.extname(item);
  const file = path.basename(item, extension);

  const modelName =
    path.dirname(item.replace(__dirname + path.sep, "")) !== "."
      ? path
          .dirname(item.replace(__dirname + path.sep, ""))
          .split(path.sep)
          .map((item, index) =>
            index === 0 ? item : capitalizeFirstLetter(item)
          )
          .join("") + capitalizeFirstLetter(file)
      : file;

  const model = require(item);

  if (typeof model === "function") {
    const loadModel = model(sequelize, defOptions, modelName);

    if (loadModel) {
      loaderFile.push(
        modelName === loadModel.name
          ? modelName
          : `${modelName} (${loadModel.name})`
      );
      db[loadModel.name] = loadModel;
    }
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

if (typeof console.logUserDone === "function") {
  console.logUserDone("SYSTEM", `DB-models:\n ${loaderFile.join(", ")}`);
} else {
  console.log("SYSTEM", `DB-models:\n ${loaderFile.join(", ")}`);
}

module.exports = db;
