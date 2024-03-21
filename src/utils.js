import multer from 'multer';  
import {fileURLToPath} from 'url';
import { dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationFolder = '';
        if (file.fieldname === 'identification') {
            destinationFolder = 'identificaciones';
        } else if (file.fieldname === 'proof_of_address') {
            destinationFolder = 'comprobantes_domicilio';
        } else if (file.fieldname === 'bank_statement') {
            destinationFolder = 'comprobantes_cuenta';
        } else {
            destinationFolder = 'otros';
        }

        const destinationPath = join(__dirname, '/public/img/documents', destinationFolder);

        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const userId = req.params.uid;
        const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `${userId}_${Date.now()}_${safeFileName}`;
        cb(null, fileName);
    }
});



export default __dirname;
export const uploader = multer({storage})


