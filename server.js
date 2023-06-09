const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for the file upload
app.post('/upload', upload.array('images'), (req, res) => {
  // Process the uploaded images and generate the collage
  const imagePaths = req.files.map((file) => file.path);

  const collageWidth = 800;
  const collageHeight = 600;

  Promise.all(
    imagePaths.map((path) =>
      Jimp.read(path).then((image) => {
        image.resize(collageWidth / 2, collageHeight / 2);
        return image;
      })
    )
  )
    .then((images) => {
      const canvas = new Jimp(collageWidth, collageHeight);
      const imageWidth = collageWidth / 2;
      const imageHeight = collageHeight / 2;
      const positions = [
        { x: 0, y: 0 },
        { x: imageWidth, y: 0 },
        { x: 0, y: imageHeight },
        { x: imageWidth, y: imageHeight },
      ];

      images.forEach((image, index) => {
        canvas.blit(image, positions[index].x, positions[index].y);
      });

      const collagePath = 'collage.jpg';
      canvas.write(collagePath, () => {
        res.send({ path: collagePath });
      });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send('Collage generation failed');
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
