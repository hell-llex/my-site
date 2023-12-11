import fs from 'fs-extra';
import { EOL } from "os";

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
  } else {
    console.log('The application has been copied successfully.', EOL);
  }
  console.log("=".repeat(50));
});
