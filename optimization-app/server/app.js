import express from 'express';
import mongoose from "mongoose";
import router from './router/router.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const db_url = `mongodb+srv://${dbUser}:${dbPass}@cluster0.jqnrhz3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => req.originalUrl === '/' ? res.redirect('/view') : next());
app.use('/api', router);
app.get('/view', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

async function startApp() {
  try {
    await mongoose.connect(db_url);
    app.listen(port, () => console.log(`Сервер http://localhost:${port}`));
  } catch (err) {
    console.log('err :>> ', err);
  }
}

startApp();
