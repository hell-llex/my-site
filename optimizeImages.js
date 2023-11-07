import prompts from "prompts";
import { EOL } from "os";
import sharp from "sharp";
import {
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
  copyFileSync,
} from "fs";
import { join, extname } from "path";
import ExifImage from "exif";
import "colors";
import { promises as fs } from "fs";
const { rename } = fs;
import { exec } from "child_process";
import robot from "robotjs";

// * =================================================================
// ! ======================== переменные =============================
// * =================================================================
let qualityOptimizeNumber = 80;
let resizeImgNumber = null;
let needOpenImg = false;
let nowOpenImg = false;
const imageNames = [];
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const inputDir = "./src/assets/img"; // Папка с исходными изображениями
const outputDirJpg = "./public/img/jpg"; // Папка для оптимизированных изображений
const outputDirWebp = "./public/img/webp"; // Папка для оптимизированных изображений
const dataFile = "./src/data.json"; // Файл для сохранения данных об оптимизированных изображениях
let optimizedData = {
  optimizedImages: {},
  totalInfo: {
    resize: resizeImgNumber,
    quality: qualityOptimizeNumber,
    totalCountImg: 0,
  },
}; // Объект для хранения данных о новых оптимизированных изображениях
let data; // Объект для хранения данных о старых оптимизированных изображениях
// * =================================================================
// ! =================================================================

const allQuestions = {
  questionStartApp: {
    type: "confirm",
    name: "startApp",
    message: "Требуется ли оптимизация изображений?",
    initial: false,
  },
  questionQualityImg: {
    type: "number",
    name: "qualityOptimize",
    message: `Качество сжатия (по умолчанию ${qualityOptimizeNumber}):`,
    initial: qualityOptimizeNumber,
    style: "default",
    increment: 10,
    min: 20,
    max: 100,
  },
  questionQualitySize: {
    needResized: {
      type: "confirm",
      name: "needResize",
      message: "Требуется ли изменить размер изображений?",
      initial: false,
    },
    resizeImg: {
      type: "number",
      name: "resizeImg",
      message: "Введите размер для обрезки по длине:",
      initial: 1000,
      style: "default",
      increment: 100,
      min: 100,
    },
  },
  questiondDescription: {
    type: "text",
    name: "descriptionImg",
    message: `Введите описание для `,
  },
  questiondCategory: {
    type: "multiselect",
    name: "categoryImg",
    message: "Выберите категории:",
    instructions: false,
    choices: [
      { name: "Portrait", value: "portrait" },
      { name: "Landscape", value: "landscape" },
      { name: "Me", value: "me" },
      { name: "Mobile", value: "mobile" },
    ],
    min: 1,
    hint: "- Пробел для выбора. Можно выбрать несколько категорий.",
  },
  questiondOpenImg: {
    type: "confirm",
    name: "needOpenImg",
    message: "Требуется ли открывать изображения?",
    initial: true,
  },
};

try {
  const jsonStringImg = await fs.readFile("./src/assets/img/data.json", "utf8");
  const jsonStringSrc = await fs.readFile("./src/data.json", "utf8");
  if (jsonStringImg && jsonStringSrc) data = JSON.parse(jsonStringImg);
} catch (error) {
  if (error.code === "ENOENT") {
    data = {
      totalInfo: {
        resize: resizeImgNumber,
        quality: qualityOptimizeNumber,
      },
      optimizedImages: {},
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

!existsSync(outputDirJpg) ? mkdirSync(outputDirJpg, { recursive: true }) : null;

!existsSync(outputDirWebp)
  ? mkdirSync(outputDirWebp, { recursive: true })
  : null;

// * =================================================================
// ! ============== список доступных изображений =====================
// * =================================================================
const listAvailableImg = () => {
  let totalCountImg = 0;
  readdirSync(inputDir).forEach((file, i) => {
    if (imageExtensions.includes(extname(file))) {
      i % 7 !== 0
        ? imageNames.push(file)
        : (imageNames.push(EOL), imageNames.push(file));
      totalCountImg++;
    }
  });

  optimizedData.totalInfo.totalCountImg = totalCountImg;

  console.log(
    EOL +
      "Список доступных изображений: " +
      totalCountImg +
      EOL +
      EOL +
      imageNames.join(" | ".green) +
      EOL
  );
};

const closeLog = () => {
  console.log("Завершение работы...");
};

// * =================================================================
// ! ================== открытие изображения =========================
// * =================================================================
const openInVSCode = (imagePath) => {
  exec(`code ${imagePath}`, (error) => {
    if (error) {
      console.error(`Ошибка при открытии изображения: ${error.message}`);
    } else {
      // console.log(`Файл ${imagePath} успешно открыт`);
      nowOpenImg = true;
    }
  });
};
// * =================================================================
// ! ================== закрытие изображения =========================
// * =================================================================
const closeFileInVSCode = () => {
  robot.keyTap("w", "command");
  nowOpenImg = false;
};
// * =================================================================
// ! ================== обновление файла data ========================
// * =================================================================
function updateDataFile(updateData) {
  // Очистить файл data.json
  writeFileSync(dataFile, "");
  writeFileSync(dataFile, JSON.stringify(updateData, null, 2));
  copyFileSync(dataFile, join(inputDir, "data.json"));
}
// * =================================================================
// ! ============ удаление отсутствующих изображений =================
// * =================================================================
function deleteUnuseFile() {
  for (const dir of [outputDirJpg, outputDirWebp]) {
    const files = readdirSync(dir);

    for (const file of files) {
      const sourceFile = join(inputDir, file.replace(/\.[^/.]+$/, "") + ".jpg");

      if (!existsSync(sourceFile)) {
        // const sourceFileName = sourceFile.split('/').pop().split('.')[0];
        // console.log('sourceFileName :>> ', sourceFileName);
        // console.log('object :>> ', optimizedData.optimizedImages[sourceFileName]);
        // optimizedData.optimizedImages[sourceFile.split('/')[sourceFile.split('/').length - 1].split('.')[0]]
        const targetFile = join(dir, file);

        if (existsSync(targetFile)) {
          unlinkSync(targetFile);

          // console.log('targetFile :>> ', targetFile, targetFile.split('/')[targetFile.split('/').length - 1]);
          console.log(
            `${">>>|".red} Удален файл, которого нет в исходной директории: ${
              targetFile.red
            }`
          );
          // optimizedData.optimizedImages.
        }
      }
    }
  }
}
// * =================================================================
// ! ================= оптимизация изображения =======================
// * =================================================================
async function optimizeImage(
  inputPath,
  outputPathJpg,
  outputPathWebp,
  fileName
) {
  // Оптимизация в формате JPEG
  return await sharp(inputPath)
    .resize(resizeImgNumber || undefined) // Измените размер по ширине
    .jpeg({ quality: qualityOptimizeNumber }) // Сжатие качества до 80%
    .toFile(outputPathJpg)
    .then(() => {
      console.log(
        `${"->".green} Оптимизировано изображение в формате JPEG: ${
          fileName.split(".")[0].blue
        }`
      );
      // Оптимизация в формате WebP
      return sharp(inputPath)
        .resize(resizeImgNumber || undefined)
        .webp({ quality: qualityOptimizeNumber })
        .toFile(outputPathWebp);
    })
    .then(() => {
      console.log(
        `${"->".green} Оптимизировано изображение в формате WebP: ${
          fileName.split(".")[0].blue
        }`
      );

      return sharp(inputPath).metadata();
    })
    .then((metadata) => {
      let imageOrient;
      if (metadata.width > metadata.height) {
        imageOrient = "horizontal"; // Горизонтальное изображение
      } else if (metadata.width < metadata.height) {
        imageOrient = "vertical"; // Вертикальное изображение
      } else {
        imageOrient = "square"; // Квадратное изображение
      }

      const { exifData } = new ExifImage({ image: inputPath }, function (
        error,
        exifData
      ) {
        if (!error) return exifData;
      });

      return { orientation: imageOrient, metadata: exifData };
    })
    .catch((err) => console.error("Ошибка оптимизации изображения:".red, err));
}

// * =================================================================
// ! ================= оптимизация изображения =======================
// * =================================================================
function createFileRenamer(index) {
  let newIndex = index;

  return async function renameFile(file, inputPath) {
    if (file.startsWith("image_") && file.endsWith(extname(file))) {
      console.log(
        ` ${"|>".green} Файл уже соответствует шаблону: ${file.blue}`
      );
      return {
        newName: file,
        newPathJpg: join(outputDirJpg, file),
        newPathWebp: join(
          outputDirWebp,
          file.replace(/\.[^/.]+$/, "") + ".webp"
        ),
        newInputPath: inputPath,
        newIndex: newIndex++,
      };
    } else {
      const oldPath = join(inputPath);
      if (imageNames.includes(`image_${newIndex}${extname(file)}`)) {
        let i = 1;
        while (imageNames.includes(`image_${i}${extname(file)}`)) {
          i++;
        }
        newIndex = i;
      }
      const name = `image_${newIndex}${extname(file)}`;
      const newInputPath = join(inputDir, name);

      await rename(oldPath, newInputPath);

      console.log(
        `${">>".green} Файл переименован: ${file.red} -> ${name.blue}`
      );
      newIndex++;
      return {
        newName: name,
        newPathJpg: join(outputDirJpg, name),
        newPathWebp: join(
          outputDirWebp,
          name.replace(/\.[^/.]+$/, "") + ".webp"
        ),
        newInputPath: newInputPath,
        newIndex: newIndex,
      };
    }
  };
}

// * =================================================================
// ! ==================== основная функция ===========================
// * =================================================================
(async () => {
  const { startApp } = await prompts(allQuestions.questionStartApp);

  needOpenImg = await prompts(allQuestions.questiondOpenImg);

  if (startApp) {
    const { qualityOptimize } = await prompts(allQuestions.questionQualityImg);
    optimizedData.totalInfo.quality = qualityOptimizeNumber = qualityOptimize;

    const { needResize } = await prompts(
      allQuestions.questionQualitySize.needResized
    );

    if (needResize) {
      const { resizeImg } = await prompts(
        allQuestions.questionQualitySize.resizeImg
      );
      optimizedData.totalInfo.quality = resizeImgNumber = resizeImg;
    }

    listAvailableImg();
    let forcedUpdate = false;

    if (
      totalInfo.resize !== resizeImgNumber ||
      totalInfo.quality !== qualityOptimizeNumber
    ) {
      forcedUpdate = true;
    }

    // * =========================================================================
    // * начало работы с файлами
    // * =========================================================================

    let index = 1;
    const files = readdirSync(inputDir);
    for (const file of files) {
      // Если файл не является изображением, пропустить его
      if (!imageExtensions.includes(extname(file))) {
        console.log(`${"---".red} Пропущен файл: ${file.red}`);
        continue;
      }

      let inputPath = join(inputDir, file);
      let outputPathJpg = join(outputDirJpg, file);
      let outputPathWebp = join(
        outputDirWebp,
        file.replace(/\.[^/.]+$/, "") + ".webp"
      );
      let shortFileName = file.split(".")[0];

      const newFile = {
        name: shortFileName,
        pathJpg: outputPathJpg,
        pathWebp: outputPathWebp,
        description: "",
        category: [],
        orientation: "",
        metadata: {},
      };

      const renameFile = createFileRenamer(index);

      try {
        const { newName, newPathJpg, newPathWebp, newInputPath, newIndex } =
          await renameFile(file, inputPath);

        newFile.name = shortFileName = newName.split(".")[0];
        newFile.pathJpg = outputPathJpg = newPathJpg;
        newFile.pathWebp = outputPathWebp = newPathWebp;
        inputPath = newInputPath;
        index = newIndex;
      } catch (err) {
        console.error(err);
      }

      // ! проверка на описание =================================
      if (
        data.optimizedImages[shortFileName] &&
        data.optimizedImages[shortFileName].description &&
        data.optimizedImages[shortFileName].description.length !== 0
      ) {
        console.log(
          `${">|".green} У файла ${shortFileName.blue} уже есть описание: ${
            data.optimizedImages[shortFileName].description
          }`
        );
        newFile.description = data.optimizedImages[shortFileName].description;
      } else {
        if (needOpenImg && !nowOpenImg) openInVSCode(inputPath);
        const newQuestiondDescription = Object.assign(
          {},
          allQuestions.questiondDescription
        );
        newQuestiondDescription.message += shortFileName + ":";
        const { descriptionImg } = await prompts(newQuestiondDescription);
        newFile.description = descriptionImg;
      }
      // ! =================================================================

      // ! проверка на категории =================================
      if (
        data.optimizedImages[shortFileName] &&
        data.optimizedImages[shortFileName].category &&
        data.optimizedImages[shortFileName].category.length !== 0
      ) {
        console.log(
          `${">|".green} У файла ${shortFileName.blue} уже выбраны категории: ${
            data.optimizedImages[shortFileName].category
          }`
        );
        newFile.category = data.optimizedImages[shortFileName].category;
      } else {
        if (needOpenImg && !nowOpenImg) openInVSCode(inputPath);
        const { categoryImg } = await prompts(allQuestions.questiondCategory);
        newFile.category = categoryImg;
      }
      // ! =================================================================

      // ! проверка на оптимизированность =================================
      if (
        existsSync(outputPathJpg) &&
        existsSync(outputPathWebp) &&
        !forcedUpdate &&
        data.optimizedImages[shortFileName] &&
        data.optimizedImages[shortFileName].orientation &&
        data.optimizedImages[shortFileName].orientation.length !== 0 &&
        data.optimizedImages[shortFileName] &&
        data.optimizedImages[shortFileName].metadata
      ) {
        console.log(
          ` ${
            "|>".green
          } Файл уже оптимизирован и данные о изображении получены: ${
            shortFileName.blue
          }`
        );
        newFile.orientation = data.optimizedImages[shortFileName].orientation;
        newFile.metadata = data.optimizedImages[shortFileName].metadata;
      } else {
        const { orientation, metadata } = await optimizeImage(
          inputPath,
          outputPathJpg,
          outputPathWebp,
          shortFileName
        );
        newFile.orientation = orientation;
        newFile.metadata = metadata;
      }

      // ! =================================================================
      newFile.pathJpg = newFile.pathJpg.replace("public", "");
      newFile.pathWebp = newFile.pathWebp.replace("public", "");
      optimizedData.optimizedImages[shortFileName] = newFile;
      if (nowOpenImg) closeFileInVSCode();
      console.log(EOL);
    }

    deleteUnuseFile();
    optimizedData.totalInfo.totalCountImg =
      Object.keys(optimizedData.optimizedImages).length - 1;
    updateDataFile(optimizedData);
    closeLog();
  } else {
    closeLog();
  }
})();
