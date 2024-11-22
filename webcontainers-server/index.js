import express from 'express';
import { snapshot } from '@webcontainer/snapshot';
import cors from 'cors';

const folderSnapshot = await snapshot('./vite-project');


const app = express();
const port = 3111;
  
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to a WebContainers app! 🥳');
});

app.get('/snapshot', (req, res) => {
    res
      .setHeader('content-type', 'application/octet-stream')
      .send(folderSnapshot);
  });
  

app.listen(port, () => {
    console.log(`App is live at http://localhost:${port}`);
});