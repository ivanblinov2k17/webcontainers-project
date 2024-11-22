import './style.css'
import { WebContainer } from '@webcontainer/api';


// snapshot is a `Buffer`
import { files } from './files';

const snapshotResponse = await fetch('http://localhost:3111/snapshot');
const snapshot = await snapshotResponse.arrayBuffer();
console.log('sas', snapshot);
const iframeEl = document.querySelector('iframe');

let webcontainerInstance;

async function startApp () {
  console.log('sas')
  

  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(snapshot);
  console.log('mounted');
//   await webcontainerInstance.mount(files);


  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  };

  startDevServer();

  firstEditor.value = await webcontainerInstance.fs.readFile('/src/App.tsx', 'utf-8');
  firstEditor.addEventListener('input', (e) => {
    writeAppTsx(e.currentTarget.value);
  });

  secondEditor.value = await webcontainerInstance.fs.readFile('/src/text.ts', 'utf-8');
  secondEditor.addEventListener('input', (e) => {
    writeTextTs(e.currentTarget.value);
  });
}

// window.addEventListener('load', startApp);
startApp()

async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }))
  // Wait for install command to exit
  return installProcess.exit;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  console.log('starting dev server')
  await webcontainerInstance.spawn('npm', ['run', 'dev']);

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });
}

/**
 * @param {string} content
 */

async function writeAppTsx(content) {
  await webcontainerInstance.fs.writeFile('/src/App.tsx', content);
}

async function writeTextTs(content) {
  await webcontainerInstance.fs.writeFile('/src/text.ts', content);
}

const firstEditor = document.querySelector('.first');
const secondEditor = document.querySelector('.second');