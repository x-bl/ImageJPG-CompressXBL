const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' });

app.post('/compress', upload.single('image'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `uploads/compressed-${Date.now()}.jpg`;

  try {
    await sharp(inputPath)
      .jpeg({ quality: 60 }) // compress jpg
      .toFile(outputPath);

    fs.unlinkSync(inputPath); // remove original
    res.download(outputPath, () => fs.unlinkSync(outputPath)); // download and delete
  } catch (err) {
    res.status(500).send('Compression failed');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
