const express = require('express');
const multer = require('multer');
var fs = require('fs');

const app = express();

const port = 3000;

app.listen(port, () => {
    console.log("Server dang chay cong: "+port);
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
})

// Set Storage

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        let fileName = file.originalname;
        arr = fileName.split('.');

        let newFileName = '';

        for (let i =0; i< arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }

        cb(null, newFileName)
    }
})


const upload = multer({storage: storage});

app.post('/uploadfile', upload.single('myfile'),( req, res, next ) => {
    // res.send('Day la ham post uploadfile');
    const file = req.file;
    if(!file) {
        const error = new Error('Can chon file de upload');
        error.httpStatusCode = 400;
        return next (error);
    }
    res.sendFile(__dirname + '/' + file.path);
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 5), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});