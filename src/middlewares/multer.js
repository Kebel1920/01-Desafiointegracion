import multer from "multer";
import path from "path";

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "profile") {
            cb(null, "uploads/profiles/");
        } else if (file.fieldname === "product") {
            cb(null, "uploads/products/");
        } else if (file.fieldname === "document") {
            cb(null, "uploads/documents/");
        } else {
            cb(null, "uploads/others/");
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export default upload;
