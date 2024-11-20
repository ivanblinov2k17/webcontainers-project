export const files = {
    'index.js': {
      file: {
        contents: `
import express from 'express';
import { text } from './second-module.js';
const app = express();
const port = 3111;
  
app.get('/', (req, res) => {
    res.send('Welcome to a WebContainers app! 🥳' + text);
});
  
app.listen(port, () => {
    console.log(\`App is live at http://localhost:\${port}\`);
});`,
      },
    },
    'package.json': {
      file: {
        contents: `
          {
            "name": "example-app",
            "type": "module",
            "dependencies": {
              "express": "latest",
              "nodemon": "latest"
            },
            "scripts": {
              "start": "nodemon index.js"
            }
          }`,
      },
    },
    'second-module.js': {
        file: {
            contents: ` export const text = "I am hello world from the second module"
            `
        }
    }
  };