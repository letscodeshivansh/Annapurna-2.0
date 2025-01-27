const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/users/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/users/index.html'));
});

const PORT = 6969;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
