import express from 'express';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Console } from 'console';

const app = express();
const port = 1000;
const helia = await createHeliaNode();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve static files from the 'public' directory
app.use(express.static('public'));

async function createHeliaNode() {
  return await createHelia()
}

async function writeToFile(filename, data) {
    try {
      const filePath = path.join(__dirname, filename);
      await fs.writeFile(filePath, data);
      console.log(`Data successfully written to ${filename}`);
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  }  

async function uploadToIPFS(helia, filePath) {
    try {
      const unixFS = unixfs(helia)
      const content = await fs.readFile(filePath)
      const cid = await unixFS.addBytes(content)
      return cid.toString()
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
}

async function uploadMultipleImages(directoryPath) {
  const files = await fs.readdir(directoryPath)
  const results = []

  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
      console.log("found image, uploading");
      const filePath = path.join(directoryPath, file)
      const cid = await uploadToIPFS(helia, filePath)
      if (cid) {
        results.push({ fileName: file, cid })
      }
    }
  }
  //await helia.stop()
  return results
}

// Express route to handle image uploads
app.get('/upload', async (req, res) => {
    const directoryPath = '../upload'
    try {
      console.log("starting image upload");
      const results = await uploadMultipleImages(directoryPath);
      writeToFile('cids.txt', JSON.stringify(results));
      res.json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred during upload' });
    }
  });

// Serve the HTML file at the root endpoint
app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.get('/ipfs-images', async (req, res) => {
    const filePath = 'cids.txt';
    const fileContents = await fs.readFile(filePath, 'utf8');
    const images = JSON.parse(fileContents);
    res.json(images);
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});