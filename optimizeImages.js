import sharp from "sharp";
import {
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
  copyFileSync,
  rename,
} from "fs";
import { join, extname } from "path";
import ExifImage from "exif";
import inquirer from "inquirer";
import "colors";
import readlineSync from "readline-sync";
import { EOL } from "os";
import { promises as fs } from "fs";

const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
let resize = null;
let quality = 80;
const imageNames = [];

let data;
try {
  const jsonString = await fs.readFile("./src/assets/img/data.json", "utf8");
  data = JSON.parse(jsonString);
} catch (error) {
  if (error.code === "ENOENT") {
    data = {
      totalInfo: {
        resize: null,
        quality: quality,
      },
    };
    await fs.writeFile(
      "./src/assets/img/data.json",
      JSON.stringify(data),
      "utf8"
    );
    await fs.writeFile("./src/data.json", JSON.stringify(data), "utf8");
  } else {
    console.error("Ошибка при чтении файла:", error);
  }
}

const { totalInfo } = data;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

let questions = [
  {
    type: "input",
    name: "length",
    message: "Введите размер для обрезки по длине:",
    validate: function (value) {
      var valid = !isNaN(parseFloat(value));
      return valid || "Пожалуйста, введите число";
    },
    filter: Number,
  },
  {
    type: "input",
    name: "quality",
    message: `Качество сжатия (по умолчанию ${quality}):`,
    validate: function (value) {
      var valid = !isNaN(parseFloat(value));
      return valid || "Пожалуйста, введите число";
    },
    filter: Number,
  },
];

inquirer
  .prompt({
    type: "confirm",
    name: "start",
    message: "Требуется ли оптимизация фотографий?",
    default: false,
  })
  .then((answers) => {
    if (answers.start) {
      return doSomething();
    } else {
      console.log("Завершение работы...");
      console.log(EOL);
      process.exit();
    }
  })
  .then(() => {
    process.stdin.resume();
  });

function doSomething() {
  inquirer.prompt(questions).then((answers) => {
    // console.log("-".repeat(70));
    resize;
    let forcedUpdate = false;
    if (answers.length) {
      resize = parseInt(answers.length);
    }
    // console.log("-".repeat(70));
    if (answers.quality) {
      quality = parseInt(answers.quality);
    }

    if (totalInfo.resize !== resize || totalInfo.quality !== quality) {
      forcedUpdate = true;
    }

    // Папка с исходными изображениями
    const inputDir = "./src/assets/img";

    // Папки для оптимизированных изображений
    const outputDirJpg = "./public/img/jpg";
    const outputDirWebp = "./public/img/webp";

    // Создать папки, если они не существуют
    if (!existsSync(outputDirJpg)) {
      mkdirSync(outputDirJpg, { recursive: true });
    }
    if (!existsSync(outputDirWebp)) {
      mkdirSync(outputDirWebp, { recursive: true });
    }

    readdirSync(inputDir).forEach((file, i) => {
      if (imageExtensions.includes(extname(file))) {
        i % 7 !== 0
          ? imageNames.push(file)
          : (imageNames.push(EOL), imageNames.push(file));
      }
    });

    console.log(
      EOL +
        "Список доступных изображений:" +
        EOL +
        EOL +
        imageNames.join(" | ".green) +
        EOL
    );

    // Файл для сохранения данных об оптимизированных изображениях
    const dataFile = "./src/data.json";

    // Массив для хранения данных об оптимизированных изображениях
    let optimizedImages = {};

    // Функция для обновления файла data.json
    function updateDataFile(
      inputPath,
      fileName,
      outputPathJpg,
      outputPathWebp,
      description
    ) {
      // Очистить файл data.json
      writeFileSync(dataFile, "");

      new ExifImage({ image: inputPath }, function (error, exifData) {
        if (error) {
          // console.log("Ошибка при чтении метаданных: " + error.message);
        } else {
          // Добавить данные об оптимизированном изображении и его метаданные в объект

          optimizedImages[fileName] = {
            name: fileName,
            pathJpg: outputPathJpg,
            pathWebp: outputPathWebp,
            metadata: exifData,
            description: description,
          };

          optimizedImages.totalInfo = {
            totalCount: Object.keys(optimizedImages).length - 1,
            resize: resize,
            quality: quality,
          };

          writeFileSync(dataFile, JSON.stringify(optimizedImages, null, 2));
          copyFileSync(dataFile, join(inputDir, "data.json"));
        }
      });
    }

    function optimizeImage(
      inputPath,
      outputPathJpg,
      outputPathWebp,
      fileName,
      description
    ) {
      // console.log(EOL);
      // Оптимизация в формате JPEG
      sharp(inputPath)
        .resize(resize || undefined) // Измените размер по ширине
        .jpeg({ quality: quality }) // Сжатие качества до 80%
        .toFile(outputPathJpg)
        .then(() => {
          console.log(
            `${"->".green} Оптимизировано изображение в формате JPEG: ${
              fileName.split(".")[0].blue
            }`
          );
          // Оптимизация в формате WebP
          return sharp(inputPath)
            .resize(resize || undefined)
            .webp({ quality: quality })
            .toFile(outputPathWebp);
        })
        .then(() => {
          console.log(
            `${"->".green} Оптимизировано изображение в формате WebP: ${
              fileName.split(".")[0].blue
            }`
          );
          // Добавить данные об оптимизированном изображении в массив
          updateDataFile(
            inputPath,
            fileName.split(".")[0],
            outputPathJpg,
            outputPathWebp,
            description
          );
        })
        .catch((err) =>
          console.error("Ошибка оптимизации изображения:".red, err)
        );
    }

    let index = 1;
    readdirSync(inputDir).forEach((file) => {
      // Если файл не является изображением, пропустить его
      if (!imageExtensions.includes(extname(file))) {
        console.log(`${"---".red}Пропущен файл: ${file.red}`);
        return;
      }

      let description = "";

      let alreadyOptimized = false;
      const inputPath = join(inputDir, file);
      let outputPathJpg = join(outputDirJpg, file);
      let outputPathWebp = join(
        outputDirWebp,
        file.replace(/\.[^/.]+$/, "") + ".webp"
      );

      if (
        data[file.split(".")[0]] &&
        data[file.split(".")[0]].description &&
        data[file.split(".")[0]].description.length !== 0
      ) {
        console.log(
          `${">|".green} У файла ${
            file.split(".")[0].blue
          } уже есть описание: ${data[file.split(".")[0]].description}`
        );

        updateDataFile(
          inputPath,
          file.split(".")[0],
          outputPathJpg,
          outputPathWebp,
          data[file.split(".")[0]].description
        );
        description = data[file.split(".")[0]].description;
      } else {
        const answer = readlineSync.question(
          `${">|".green} Введите описание для ${
            file.split(".")[0]
          } или нажмите Enter, чтобы пропустить:`
        ); // потом переделать на асинхронный код
        if (answer) {
          description = answer;
          updateDataFile(
            inputPath,
            file.split(".")[0],
            outputPathJpg,
            outputPathWebp,
            description
          );
        }
      }

      // Если файл уже существует, пропустить его
      if (
        existsSync(outputPathJpg) &&
        existsSync(outputPathWebp) &&
        !forcedUpdate
      ) {
        console.log(
          ` ${"|>".green} Файл уже оптимизирован: ${file.split(".")[0].blue}`
        );
        updateDataFile(
          inputPath,
          file.split(".")[0],
          outputPathJpg,
          outputPathWebp,
          description
        );
        alreadyOptimized = true;
        // return;
      }

      if (forcedUpdate) alreadyOptimized = false;

      if (file.startsWith("image_") && file.endsWith(extname(file))) {
        console.log(
          ` ${"|>".green} Файл уже соответствует шаблону: ${file.blue}`
        );
        if (!alreadyOptimized)
          optimizeImage(
            inputPath,
            outputPathJpg,
            outputPathWebp,
            file,
            description
          );
        // return;
      } else {
        const oldPath = join(inputPath);
        if (imageNames.includes(`image_${index}${extname(file)}`)) {
          let i = 1;
          while (imageNames.includes(`image_${i}${extname(file)}`)) {
            i++;
          }
          index = i;
        }
        const newName = `image_${index}${extname(file)}`;
        const newPath = join(inputDir, newName);

        rename(oldPath, newPath, (err) => {
          if (err) throw err;
          console.log(
            // EOL +
            `${">>".green} Файл переименован: ${file.red} -> ${newName.blue}`
          );
          outputPathJpg = join(outputDirJpg, newName);
          outputPathWebp = join(
            outputDirWebp,
            newName.replace(/\.[^/.]+$/, "") + ".webp"
          );

          // Оптимизация в формате JPEG
          if (!alreadyOptimized)
            optimizeImage(
              newPath,
              outputPathJpg,
              outputPathWebp,
              newName,
              description
            );
        });
      }

      // console.log("-".repeat(70));
      index++;
    });

    // console.log(EOL);
    // Проверить все файлы в целевых директориях
    for (const dir of [outputDirJpg, outputDirWebp]) {
      const files = readdirSync(dir);

      for (const file of files) {
        const sourceFile = join(
          inputDir,
          file.replace(/\.[^/.]+$/, "") + ".jpg"
        );

        if (!existsSync(sourceFile)) {
          const targetFile = join(dir, file);

          if (existsSync(targetFile)) {
            unlinkSync(targetFile);
            console.log(
              `${">>>|".red} Удален файл, которого нет в исходной директории: ${
                targetFile.red
              }`
            );
          }
        }
      }
    }
  });
}
