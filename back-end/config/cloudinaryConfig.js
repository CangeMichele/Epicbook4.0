import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export { cloudinary };


// Upload immagine su Cloudinary usando buffer (RAM).
// Se publicId è presente → sovrascrive l'immagine esistente
// Se publicId non è presente → Cloudinary genera un nuovo public_id
// assegnando folder (id è formato dal folder come prefisso)

export const replaceCloudinaryImage = ({ buffer, publicId }) => {

  return new Promise((resolve, reject) => {
    
    const options = {
      invalidate: true,
      resource_type: "image"
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    } else {
       options.folder = "epicbook/avatar";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
