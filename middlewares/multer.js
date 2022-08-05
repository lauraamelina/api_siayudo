import multer, { diskStorage } from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
const s3 = new aws.S3();

//configuramos multer s3
const uploadFile = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bucket-name',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        }
    })
}).single('image')


//configuramos aws sdk para subir archivos a s3

aws.config.update({
    accessKeyId: 'AKIA6LWUN6E7JHYCIUXB',
    secretAccessKey: '86CcIyfvF03V6J9Ezg33RW96qR9biJvF4uXbyd',
    region: 'us-east-1'
});

// function uploadFile(){
//     const storage = diskStorage({
//         destination: './public/files',
//         filename: function (req, file, cb) {
//             var extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
//                 cb(null,Date.now() + extension );
//         }
//     })
//     const upload = multer({ storage: storage }).single('image')
//     return upload;
// }
export default uploadFile;
