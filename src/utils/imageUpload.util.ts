import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
};

export const S3Upload = (folder) => multer({
    fileFilter,
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 't4bucket0',
        acl: 'public-read',
        key(req, file, cb) { // S3 t4bucket0에 있는 original 폴더에 업로드 할 것임.
            cb(null, `${folder}/${+new Date()}${path.basename(file.originalname)}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});