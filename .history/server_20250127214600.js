const express = require('express');
const app = express();
const path = require('path');

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
