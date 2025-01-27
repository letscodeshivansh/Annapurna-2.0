const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/users/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/users/index.html'));
});

app.post('/submit-food', upload.single('photo'), (req, res) => {
    const { foodType, quantity, duration, location } = req.body;
    const foodPhoto = req.file.filename;

    console.log('New Food Entry:');
    console.log(`Type: ${foodType}, Quantity: ${quantity}, Duration: ${duration} hours`);
    console.log(`Location: ${location}, Image: ${foodPhoto}`);

    res.send(`<h2>Food submitted successfully!</h2><a href="/">Go Back</a>`);
});

const PORT = 6969;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
