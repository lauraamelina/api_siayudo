import multer, { diskStorage } from 'multer'

function uploadFile(){
    const storage = diskStorage({
        destination: './public/files',
        filename: function (req, file, cb) {
            var extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
                cb(null,Date.now() + extension );
        }
    })
    // para cargar 1 archivo desde 1 input
    const upload = multer({ storage: storage }).single('image')
    //para cargar +1 archivo desde 1 input
    // const upload = multer({ storage: storage }).const upload = multer({ storage: storage }).array('file',3);
    // para cargar +1 archivo en varios inputs
    // // const upload = multer({ storage: storage }).const upload = multer({ storage: storage }).field([
    //   {name :"file1", maxCount: 2},
    //   {name :"file2", maxCount: 1},
    return upload;
}
export default uploadFile;
