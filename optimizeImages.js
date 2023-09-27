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
import readline from "readline";
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
      }, // Замените это на ваши базовые значения
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("=".repeat(70));
rl.question(`Введите размер для обрезки по длине: ${EOL}`, (answer) => {
  console.log("=".repeat(70));
  let forcedUpdate = false;
  if (answer) {
    resize = parseInt(answer);
  }
  if (answer.length !== 0 && isNaN(Number(answer))) {
    throw new Error("Неверный формат данных");
  }
  console.log("=".repeat(70));
  rl.question(`Качество сжатия (по умолчанию ${quality}): ${EOL}`, (answer) => {
    console.log("=".repeat(70));
    if (answer) {
      quality = parseInt(answer);
    }
    if (answer.length !== 0 && isNaN(Number(answer))) {
      throw new Error("Неверный формат данных");
    }
    rl.close();

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

    console.log("Список доступных изображений:" + EOL, imageNames.join(" | "));

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
      // Оптимизация в формате JPEG
      sharp(inputPath)
        .resize(resize || undefined) // Измените размер по ширине
        .jpeg({ quality: quality }) // Сжатие качества до 80%
        .toFile(outputPathJpg)
        .then(() => {
          console.log(
            `Оптимизировано изображение в формате JPEG: ${
              fileName.split(".")[0]
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
            `Оптимизировано изображение в формате WebP: ${
              fileName.split(".")[0]
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
        .catch((err) => console.error("Ошибка оптимизации изображения:", err));
    }

    let index = 1;
    console.log("=".repeat(70));
    readdirSync(inputDir).forEach((file) => {
      // Если файл не является изображением, пропустить его
      if (!imageExtensions.includes(extname(file))) {
        console.log(`Пропущен файл: ${file}`);
        return;
      }
      console.log("=".repeat(70));

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
          `У файла ${file.split(".")[0]} уже есть описание: ${
            data[file.split(".")[0]].description
          }`
        );

        updateDataFile(
          inputPath,
          file.split(".")[0],
          outputPathJpg,
          outputPathWebp,
          data[file.split(".")[0]].description
        );
        description = data[file.split(".")[0]].description;
        // return;
      } else {
        const answer = readlineSync.question(
          `Введите описание для ${
            file.split(".")[0]
          } или нажмите Enter, чтобы пропустить: ${EOL}`
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
        console.log(`Файл уже оптимизирован: ${file.split(".")[0]}`);
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

      if (file.startsWith("image-") && file.endsWith(extname(file))) {
        console.log(`Файл уже соответствует шаблону: ${file}`);
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
        if (imageNames.includes(`image-${index}${extname(file)}`)) {
          while (imageNames.includes(`image-${index}${extname(file)}`)) index++;
        }
        const newName = `image-${index}${extname(file)}`;
        const newPath = join(inputDir, newName);

        rename(oldPath, newPath, (err) => {
          if (err) throw err;
          console.log(`Файл переименован: ${file} -> ${newName}`);
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

      console.log("=".repeat(70));
      index++;
    });

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
              `Удален файл, которого нет в исходной директории: ${targetFile}`
            );
            console.log(EOL);
          }
        }
      }
    }
  });
});
