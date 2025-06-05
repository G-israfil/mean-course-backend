const multer = require("multer");
const path = require("path");
const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/PNG':'PNG',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const uploadPath = path.join(__dirname, '../images');

        cb(null, uploadPath);
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext)
    },
})

const upload = multer({ storage: storage });

module.exports = upload.single('image');
