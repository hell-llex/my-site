import fs from 'fs-extra';
import { EOL } from "os";
import path from 'path';

const sourcePath = '../optimization-app';
const targetPath = '../optimization-app-local';

console.log("=".repeat(50), EOL);
console.log('Starts checking and copying the application.', EOL);

if (fs.existsSync(targetPath)) {
  fs.removeSync(targetPath);
}

fs.copy(sourcePath, targetPath, { recursive: true, overwrite: true, dereference: true }, (err) => {
  if (err) {
    console.error('Error copying the application:', err, EOL);
    console.log("=".repeat(50));
    return;
  }

  const packageJsonPath = path.join(targetPath, 'package.json');

  fs.readFile(packageJsonPath, 'utf-8', async (readErr, data) => {
    if (readErr) {
      console.error('Error reading package.json:', readErr, EOL);
      console.log("=".repeat(50));
      return;
    }
    const updatedData = await modifyPackageJson(data);
    fs.writeFile(packageJsonPath, updatedData, 'utf-8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing package.json:', writeErr, EOL);
      } else {
        console.log('The application has been copied successfully.', EOL);
      }
      console.log("=".repeat(50));
    });
  });
});

async function modifyPackageJson(data) {
  const newData = data.replace('"copy-app": "node copyApp.js",', "");
  return newData;
}
