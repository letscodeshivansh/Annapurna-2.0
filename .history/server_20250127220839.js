const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/users/index.html'));
});

app.post('/submit-food', upload.single('foodImage'), (req, res) => {
  const { foodType, quantity, duration, location } = req.body;
  console.log('Food submission:', {
    foodType,
    quantity,
    duration,
    location,
    image: req.file.filename,
  });
  res.send('Food submission successful!');
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
