import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryUploader = multer({
    storage:multer.memoryStorage(), // salva in RAM
    limits:{
        fileSize:5*1024*1024, //5MB
    },
    fileFilter: (req,file, cb) => {
        if(!file.mimetype.startsWith("image/")){
            cb(new Error("Il file non è un immagine")); // callback errore
        }
        cb(null, true); //callback nessun erorre,
    }
})

export { cloudinary, cloudinaryUploader};