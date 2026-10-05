// ***** ELIMINA UTENTE ****

import User from "../../../models/User.js";
import { cloudinary } from "../../../config/cloudinaryConfig.js";


export async function deleteUser(inputDelete) {
    //recupero dati 
    const { _id, password } = inputDelete;

    try {
        //ricerca user tramite _id
        const user = await User.findOne({ _id });
        
        //confronto password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {

            return {
                ok: false,
                error: {
                    code: "AUTH_ERROR",
                    reason: "mismatch_password",
                    message: "Password errata",
                    details: { field: "password" }

                }
            }
        }

        //recupero avatar_id
        const avatar_id = user.avatar_id;
        const avatar_url = user.avatar_url;

        //elimino avatar da Cloudinary
        const resAvatarDelete = await cloudinary.uploader.destroy(avatar_id, { resource_type: "image" });

        if (resAvatarDelete.result !== "ok") {
            return {
                ok: false,
                error: {
                    code: "CLOUDINARY_ERROR",
                    reason: "not_delete",
                    message: "Impossibile eliminare risorsa.",
                    details: { avatar_id, avatar_url }

                }
            };
        }

        //elimina utente dal DB
        const resUserDelete = await User.findByIdAndDelete(_id);

        if (!resUserDelete) {
            return {
                ok: false,
                error: {
                    code: "NOT_FOUND",
                    reason: "delete_user",
                    message: "Impossibile eliminare risorsa.",
                    details: { _id, userName: user.userName }

                }
            }
        }

        return {
            ok: true,
            data: resUserDelete
        }

    } catch (error) {
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "delete_user",
                message: error.message
            }
        };
    }
};
