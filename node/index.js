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

async function createHeliaNode() {
  return await createHelia()
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
      res.json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred during upload' });
    }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});