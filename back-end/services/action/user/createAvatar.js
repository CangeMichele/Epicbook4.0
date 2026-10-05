// ***** UPLOAD NUOVO AVATAR  ****
import { replaceCloudinaryImage } from "../../../config/cloudinaryConfig.js";

export async function createAvatar(file) {

    //default avatar
    const avatarData = {
        avatar_url: "https://res.cloudinary.com/dvbmskxg4/image/upload/v1772792679/epicbook/avatar/avt_default.png",
        avatar_id: "epicbook/avatar/avt_default"
    };

    //se file assente restitusce default
    if (!file) return {
        ok: true,
        data: avatarData,
    }

    //upload immagine su cloudinary
    try {
        const uploaded = await replaceCloudinaryImage({
            buffer: file.buffer,
        });
        
        avatarData.avatar_url = uploaded.secure_url;
        avatarData.avatar_id = uploaded.public_id;
        return {
            ok: true,
            data: avatarData
        }

    } catch (error) {
        //mostra errore    
        console.error(error);

        //procede con avataData default
        return {
            ok: true,
            data: avatarData,
            warning: {
                code: "CLOUDINARY_FAILURE",
                reason: "not_uploaded",
                message: "Errore caricamento file. Asseganzione immagine default",
            }
        }
    }




}