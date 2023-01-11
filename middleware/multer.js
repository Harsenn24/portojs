const multer = require('multer');
const uploadImage = multer({ dest: 'uploads/' })
const result_image = uploadImage.array("image")

module.exports = { result_image }