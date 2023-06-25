const path = require("path");
const file = require("file");
const { Router } = require("express");

const basename = path.basename(__filename); // получаем имя файла скрипта(index.js)



let findFile = []; //Массив для путей к файлам моделей
let controllers = []

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

    const router = new Router()

    const loadModel = model(router, modelName);

    if (loadModel) {
      loaderFile.push(modelName);
      controllers.push({name: `/${modelName}`, router})
    }
  }
});

if (typeof console.logUserDone === "function") {
  console.logUserDone("SYSTEM", `controllers:\n ${loaderFile.join(", ")}`);
} else {
  console.log("SYSTEM", `controllers:\n ${loaderFile.join(", ")}`);
}

module.exports = controllers;
