let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '.jpge');
    }
  })
  
let upload = multer({ storage: storage })

module.exports = {
    upload,
}
