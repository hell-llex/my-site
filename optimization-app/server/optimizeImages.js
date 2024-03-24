import prompts from "prompts";
import { EOL } from "os";
import sharp from "sharp";
import {
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
} from "fs";
import { join, extname } from "path";
import ExifImage from "exif";
import "colors";
import { promises as fs } from "fs";
const { rename } = fs;
import { exec } from "child_process";
import robot from "robotjs";
import deepEqual from 'deep-equal';

// * =================================================================
// ! ======================== переменные =============================
// * =================================================================
let qualityOptimizeNumber = 80;
let resizeImgNumber = null;
let needOpenImg = false;
let nowOpenImg = false;
let forcedUpdate = false;
const imagesNames = [];
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const inputDirPhoto = "./assets/img"; // Папка с исходными изображениями
const inputDirProject = "./assets/project"; // Папка с исходными проектами
let outputDirPhotoJpg = "../FOLDER/public/img/jpg"; // Папка для оптимизированных изображений
let outputDirPhotoWebp = "../FOLDER/public/img/webp"; // Папка для оптимизированных изображений
let outputDirPhotoThumbnail = "../FOLDER/public/img/thumbnail"; // Папка для оптимизированных миниатюр
let outputDirProjectJpg = "../FOLDER/public/project/jpg"; // Папка для оптимизированных проектов
let outputDirProjectWebp = "../FOLDER/public/project/webp"; // Папка для оптимизированных проектов
let outputDirProjectThumbnail = "../FOLDER/public/project/thumbnail"; // Папка для оптимизированных проектов
const dataFilePhoto = "./assets/img/data.json"; // Файл для сохранения данных об оптимизированных изображениях
const dataFileProject = "./assets/project/data.json"; // Файл для сохранения данных об оптимизированных проектов
let outputDirDataPhoto = "../FOLDER/public/img/data.json"; // Папка для оптимизированных изображений
let outputDirDataProject = "../FOLDER/public/project/data.json"; // Папка для оптимизированных проектов
let optimizedDataPhoto = {
  optimizedImages: {},
  totalInfo: {
    resize: resizeImgNumber,
    quality: qualityOptimizeNumber,
    totalCount: 0,
  },
}; // Объект для хранения данных о новых оптимизированных изображениях
let optimizedDataProject = {
  optimizedImages: {},
  totalInfo: {
    resize: resizeImgNumber,
    quality: qualityOptimizeNumber,
    totalCount: 0,
  },
}; // Объект для хранения данных о новых оптимизированных изображениях
let dataPhoto; // Объект для хранения данных о старых оптимизированных изображениях
let dataProject; // Объект для хранения данных о старых оптимизированных изображениях
let totalInfoPhoto;
let totalInfoProject;
// * =================================================================
// ! =================================================================

const allQuestions = {
  questionStartApp: {
    type: "confirm",
    name: "startApp",
    message: "Требуется ли оптимизация изображений?",
    initial: false,
  },
  questionProject: {
    type: "select",
    name: "project",
    message: "Выберите проект:",
    instructions: false,
    choices: [
      { name: "React", value: "react-site" },
      { name: "Vue", value: "vue-site" },
      { name: "Js", value: "js-site" },
    ],
    initial: 0,
    hint: "- Пробел для выбора.",
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
  questionDescription: {
    type: "text",
    name: "descriptionImg",
    message: `Введите описание для `,
  },
  questionName: {
    type: "text",
    name: "nameProject",
    message: `Введите имя для `,
  },
  questionCategoryPhoto: {
    type: "multiselect",
    name: "categoryFile",
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
  questionCategoryProject: {
    type: "multiselect",
    name: "categoryFile",
    message: "Выберите категории:",
    instructions: false,
    choices: [
      { name: "Vanilla", value: "vanilla" },
      { name: "React", value: "react" },
      { name: "Vue", value: "vue" },
      { name: "Other", value: "other" },
    ],
    min: 1,
    hint: "- Пробел для выбора. Можно выбрать несколько категорий.",
  },
  questionOpenImg: {
    type: "confirm",
    name: "openImg",
    message: "Требуется ли открывать изображения?",
    initial: true,
  },
};
async function checkDataFile(dataFilePath, data) {
  try {
    const jsonString = await fs.readFile(dataFilePath, "utf8");
    if (jsonString) return JSON.parse(jsonString);
  } catch (error) {
    if (error.code === "ENOENT") {
      data = {
        totalInfo: {
          resize: resizeImgNumber,
          quality: qualityOptimizeNumber,
        },
        optimizedImages: {},
      };

      await fs.writeFile(dataFilePath, JSON.stringify(data), "utf8");
      return data;
    } else {
      console.error("Ошибка при чтении файла:", error);
      throw error;
    }
  }
}

// * =================================================================
// ! ============== список доступных изображений =====================
// * =================================================================
async function listAvailableImg(inputPathFolder, typeFile) {
  let totalCountFile = 0;
  imagesNames.length = 0;
  readdirSync(inputPathFolder).forEach((file, i) => {
    if (imageExtensions.includes(extname(file))) {
      i % 7 !== 0
        ? imagesNames.push(file)
        : (imagesNames.push(EOL), imagesNames.push(file));
      totalCountFile++;
    }
  });

  console.log(
    EOL +
    `Список доступных ${typeFile}: ` +
    totalCountFile +
    EOL +
    EOL +
    imagesNames.join(" | ".green) +
    EOL
  );

  return totalCountFile;
}

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
function updateDataFile(updateData, pathDataFile) {
  // Очистить файл data.json
  writeFileSync(pathDataFile, "");
  writeFileSync(pathDataFile, JSON.stringify(updateData, null, 2));
}
// * =================================================================
// ! ============ удаление отсутствующих изображений =================
// * =================================================================
function deleteUnusedFile(outputDirJpg, outputDirWebp, outputDirThumbnailWebp, inputDir) {
  for (const dir of [outputDirJpg, outputDirWebp, outputDirThumbnailWebp]) {
    const files = readdirSync(dir);

    for (const file of files) {
      let fileExistsSync = false;
      imageExtensions.forEach((elem) => {
        const sourceFile = join(inputDir, file.replace(/\.[^/.]+$/, "") + elem);
        if (existsSync(sourceFile)) fileExistsSync = !existsSync(sourceFile);
      });
      if (fileExistsSync) {
        const targetFile = join(dir, file);
        if (existsSync(targetFile)) {
          unlinkSync(targetFile);
          console.log(
            `${">>>|".red} Удален файл, которого нет в исходной директории: ${targetFile.red
            }`
          );
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
  outputPathThumbnail,
  fileName
) {
  // Оптимизация в формате JPEG
  return await sharp(inputPath)
    .resize(resizeImgNumber || undefined) // Измените размер по ширине
    .jpeg({ quality: qualityOptimizeNumber }) // Сжатие качества до 80%
    .toFile(outputPathJpg)
    .then(() => {
      console.log(
        `${"->".green} Оптимизировано изображение в формате JPEG: ${fileName.split(".")[0].blue
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
        `${"->".green} Оптимизировано изображение в формате WebP: ${fileName.split(".")[0].blue
        }`
      );

      return sharp(inputPath)
        .resize(900)
        .webp({ quality: 60 })
        .toFile(outputPathThumbnail);
    })
    .then(() => {
      console.log(
        `${"->".green} Оптимизировано изображение в миниатюру WebP: ${fileName.split(".")[0].blue
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

  return async function renameFile(
    file,
    inputPath,
    outputDirJpg,
    outputDirWebp,
    outputDirThumbnail,
    inputDir
  ) {
    const patternName = inputDir.includes("img") ? "image_" : "project_";
    if (file.startsWith(patternName) && file.endsWith(extname(file))) {
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
        newPathThumbnail: join(
          outputDirThumbnail,
          file.replace(/\.[^/.]+$/, "") + ".webp"
        ),
        newInputPath: inputPath,
        newIndex: newIndex++,
      };
    } else {
      const oldPath = join(inputPath);
      if (imagesNames.includes(`${patternName}${newIndex}${extname(file)}`)) {
        let i = 1;
        while (imagesNames.includes(`${patternName}${i}${extname(file)}`)) {
          i++;
        }
        newIndex = i;
      }
      const name = `${patternName}${newIndex}${extname(file)}`;
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
        newPathThumbnail: join(
          outputDirThumbnail,
          file.replace(/\.[^/.]+$/, "") + ".webp"
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
async function fileHandling(
  index,
  outputDirJpg,
  outputDirWebp,
  outputDirThumbnail,
  inputDir,
  data
) {
  let optimizedData = {
    optimizedImages: {},
  };
  const files = readdirSync(inputDir);
  for (const file of files) {
    // Если файл не является изображением, пропустить его
    if (!imageExtensions.includes(extname(file))) {
      console.log(`${"---".red} Пропущен файл: ${file.red}`, EOL);
      continue;
    }

    let fileImg = inputDir.includes("img");
    let inputPath = join(inputDir, file);
    let outputPathJpg = join(outputDirJpg, file);
    let outputPathWebp = join(
      outputDirWebp,
      file.replace(/\.[^/.]+$/, "") + ".webp"
    );
    let outputPathThumbnail = join(
      outputDirThumbnail,
      file.replace(/\.[^/.]+$/, "") + ".webp"
    );
    let shortFileName = file.split(".")[0];

    const newFile = {
      name: shortFileName,
      pathJpg: outputPathJpg,
      pathWebp: outputPathWebp,
      pathThumbnail: outputPathThumbnail,
      description: "",
      category: [],
      orientation: "",
      metadata: {},
    };

    const renameFile = createFileRenamer(index);

    try {
      const { newName, newPathJpg, newPathWebp, newPathThumbnail, newInputPath, newIndex } =
        await renameFile(
          file,
          inputPath,
          outputDirJpg,
          outputDirWebp,
          outputDirThumbnail,
          inputDir
        );

      shortFileName = newName.split(".")[0];
      if (fileImg) newFile.name = shortFileName;
      newFile.pathJpg = outputPathJpg = newPathJpg;
      newFile.pathWebp = outputPathWebp = newPathWebp;
      newFile.pathThumbnail = outputPathThumbnail = newPathThumbnail;
      inputPath = newInputPath;
      index = newIndex;
    } catch (err) {
      console.error(err);
    }

    // ! проверка на имя проекта =================================
    if (!fileImg) {
      if (
        data.optimizedImages[shortFileName] &&
        data.optimizedImages[shortFileName].name !== shortFileName &&
        data.optimizedImages[shortFileName].name.length !== 0
      ) {
        console.log(
          `${">|".green} У файла ${shortFileName.blue} уже есть имя: ${data.optimizedImages[shortFileName].name
          }`
        );
        newFile.name = data.optimizedImages[shortFileName].name;
      } else {
        if (needOpenImg && !nowOpenImg) openInVSCode(inputPath);
        const newQuestionName = Object.assign(allQuestions.questionName);
        newQuestionName.message += shortFileName + ":";
        const { nameProject } = await prompts(newQuestionName);
        newFile.name = nameProject;
      }
    }
    // ! =================================================================

    // ! проверка на описание =================================
    if (
      data.optimizedImages[shortFileName] &&
      data.optimizedImages[shortFileName].description &&
      data.optimizedImages[shortFileName].description.length !== 0
    ) {
      console.log(
        `${">|".green} У файла ${shortFileName.blue} уже есть описание: ${data.optimizedImages[shortFileName].description
        }`
      );
      newFile.description = data.optimizedImages[shortFileName].description;
    } else {
      if (needOpenImg && !nowOpenImg) openInVSCode(inputPath);
      const newQuestiondDescription = Object.assign(
        {},
        allQuestions.questionDescription
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
        `${">|".green} У файла ${shortFileName.blue} уже выбраны категории: ${data.optimizedImages[shortFileName].category
        }`
      );
      newFile.category = data.optimizedImages[shortFileName].category;
    } else {
      if (needOpenImg && !nowOpenImg) openInVSCode(inputPath);
      const { categoryFile } = await prompts(
        fileImg
          ? allQuestions.questionCategoryPhoto
          : allQuestions.questionCategoryProject
      );
      newFile.category = categoryFile;
    }
    // ! =================================================================

    // ! проверка на оптимизированность =================================
    if (
      existsSync(outputPathJpg) &&
      existsSync(outputPathWebp) &&
      existsSync(outputPathThumbnail) &&
      !forcedUpdate &&
      data.optimizedImages[shortFileName] &&
      data.optimizedImages[shortFileName].orientation &&
      data.optimizedImages[shortFileName].orientation.length !== 0 &&
      data.optimizedImages[shortFileName] &&
      data.optimizedImages[shortFileName].metadata
    ) {
      console.log(
        ` ${"|>".green
        } Файл уже оптимизирован и данные о изображении получены: ${shortFileName.blue
        }`
      );
      newFile.orientation = data.optimizedImages[shortFileName].orientation;
      newFile.metadata = data.optimizedImages[shortFileName].metadata;
    } else {
      const { orientation, metadata } = await optimizeImage(
        inputPath,
        outputPathJpg,
        outputPathWebp,
        outputPathThumbnail,
        shortFileName
      );
      newFile.orientation = orientation;
      newFile.metadata = metadata;
    }

    // ! =================================================================
    newFile.pathJpg = '/' + newFile.pathJpg.split('/').slice(3).join('/');
    newFile.pathWebp = '/' + newFile.pathWebp.split('/').slice(3).join('/');
    newFile.pathThumbnail = '/' + newFile.pathThumbnail.split('/').slice(3).join('/');
    optimizedData.optimizedImages[shortFileName] = newFile;
    if (nowOpenImg) closeFileInVSCode();
    console.log(EOL);
  }
  return optimizedData.optimizedImages;
}

// * =================================================================
// ! ============= начало выполнения с вопросами =====================
// * =================================================================
(async () => {
  const { startApp } = await prompts(allQuestions.questionStartApp);
  const { project } = await prompts(allQuestions.questionProject);

  if (startApp && project) {

    [outputDirPhotoJpg, outputDirPhotoWebp, outputDirPhotoThumbnail, outputDirDataPhoto, outputDirProjectJpg, outputDirProjectWebp, outputDirProjectThumbnail, outputDirDataProject] =
      [outputDirPhotoJpg, outputDirPhotoWebp, outputDirPhotoThumbnail, outputDirDataPhoto, outputDirProjectJpg, outputDirProjectWebp, outputDirProjectThumbnail, outputDirDataProject].map(elem => elem.replace("FOLDER", project))

    !existsSync(outputDirPhotoJpg)
      ? mkdirSync(outputDirPhotoJpg, { recursive: true })
      : null;
    !existsSync(outputDirPhotoWebp)
      ? mkdirSync(outputDirPhotoWebp, { recursive: true })
      : null;
    !existsSync(outputDirPhotoThumbnail)
      ? mkdirSync(outputDirPhotoThumbnail, { recursive: true })
      : null;
    !existsSync(outputDirProjectJpg)
      ? mkdirSync(outputDirProjectJpg, { recursive: true })
      : null;
    !existsSync(outputDirProjectWebp)
      ? mkdirSync(outputDirProjectWebp, { recursive: true })
      : null;
    !existsSync(outputDirProjectThumbnail)
      ? mkdirSync(outputDirProjectThumbnail, { recursive: true })
      : null;

    // * =========================================================================
    // * проверка и сравнение файлов data
    // * =========================================================================
    let sourcedataPhoto = await checkDataFile(dataFilePhoto, dataPhoto);
    let targetdataPhoto = await checkDataFile(outputDirDataPhoto, dataPhoto);
    const sourcedataPhotoUTF = await fs.readFile(dataFilePhoto, 'utf-8');
    const targetdataPhotoUTF = await fs.readFile(outputDirDataPhoto, 'utf-8');
    let sourcedataProject = await checkDataFile(dataFileProject, dataProject);
    let targetdataProject = await checkDataFile(outputDirDataProject, dataProject);
    const sourcedataProjectUTF = await fs.readFile(dataFileProject, 'utf-8');
    const targetdataProjectUTF = await fs.readFile(outputDirDataProject, 'utf-8');

    if (deepEqual(JSON.parse(sourcedataPhotoUTF), JSON.parse(targetdataPhotoUTF))) dataPhoto = sourcedataPhoto;
    else dataPhoto = targetdataPhoto;
    if (deepEqual(JSON.parse(sourcedataProjectUTF), JSON.parse(targetdataProjectUTF))) dataProject = sourcedataProject;
    else dataProject = targetdataProject;

    totalInfoPhoto = dataPhoto.totalInfo;
    totalInfoProject = dataProject.totalInfo;

    // * =========================================================================
    // * продолжение работы по вопросам
    // * =========================================================================
    const { openImg } = await prompts(allQuestions.questionOpenImg);
    needOpenImg = openImg

    const { qualityOptimize } = await prompts(allQuestions.questionQualityImg);
    optimizedDataPhoto.totalInfo.quality =
      optimizedDataProject.totalInfo.quality =
      qualityOptimizeNumber =
      qualityOptimize;

    const { needResize } = await prompts(
      allQuestions.questionQualitySize.needResized
    );

    if (needResize) {
      const { resizeImg } = await prompts(
        allQuestions.questionQualitySize.resizeImg
      );
      optimizedDataPhoto.totalInfo.quality =
        optimizedDataProject.totalInfo.quality =
        resizeImgNumber =
        resizeImg;
    }

    if (
      totalInfoPhoto.resize !== resizeImgNumber ||
      totalInfoPhoto.quality !== qualityOptimizeNumber ||
      totalInfoProject.resize !== resizeImgNumber ||
      totalInfoProject.quality !== qualityOptimizeNumber
    ) {
      forcedUpdate = true;
    }

    let index = 1;

    // * =========================================================================
    // * начало работы с фото
    // * =========================================================================
    optimizedDataPhoto.totalInfo.totalCount = await listAvailableImg(
      inputDirPhoto,
      "photo",
      optimizedDataPhoto
    );
    optimizedDataPhoto.optimizedImages = await fileHandling(
      index,
      outputDirPhotoJpg,
      outputDirPhotoWebp,
      outputDirPhotoThumbnail,
      inputDirPhoto,
      dataPhoto
    );
    deleteUnusedFile(outputDirPhotoJpg, outputDirPhotoWebp, outputDirPhotoThumbnail, inputDirPhoto);
    optimizedDataPhoto.totalInfo.totalCount =
      Object.keys(optimizedDataPhoto.optimizedImages).length;
    updateDataFile(optimizedDataPhoto, dataFilePhoto);
    updateDataFile(optimizedDataPhoto, outputDirDataPhoto);

    // * =========================================================================
    // * начало работы с проектами
    // * =========================================================================
    optimizedDataProject.totalInfo.totalCount = await listAvailableImg(
      inputDirProject,
      "project",
      optimizedDataProject
    );
    optimizedDataProject.optimizedImages = await fileHandling(
      index,
      outputDirProjectJpg,
      outputDirProjectWebp,
      outputDirProjectThumbnail,
      inputDirProject,
      dataProject
    );
    deleteUnusedFile(outputDirProjectJpg, outputDirProjectWebp, outputDirProjectThumbnail, inputDirProject);
    optimizedDataProject.totalInfo.totalCount =
      Object.keys(optimizedDataProject.optimizedImages).length;
    updateDataFile(optimizedDataProject, dataFileProject);
    updateDataFile(optimizedDataProject, outputDirDataProject);

    closeLog();
  } else {
    closeLog();
  }
})();
