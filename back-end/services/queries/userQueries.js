//*** QUERY PER  DATI UTENTE ***

import { generateJWT } from "../../utils/jwt.js";
import User from "../../models/User.js";

// --------------------------   POST   -------------------------------------
//#region POST

//--> salvaggio nuovo utente
export async function saveNewUser(newUserData) {

    try {
        const newUser = new User(newUserData);
        await newUser.save();

        const response = newUser.toObject();
        delete response.password;

        //generazione token JWT tramite id
        const token = await generateJWT({ id: newUser._id });

        return {
            ok: true,
            token: token,
            data: response
        }

    } catch (error) {
        //errore campo univoco
        if (error.code === 11000) {
            console.error("Errore campi univoci", error.keyValue)
            return {
                ok: false,
                error: {
                    code: "MONGO_ERROR",
                    reason: "not_unique",
                    message: `${Object.keys(error.keyPattern)[0]} già in uso. Riprova.`,
                    details: error.keyValue
                }
            }
        }
        //altri errori
        console.error("Errore salvataggio nuovo utente", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }
};
//#endregion

// --------------------------   GET   --------------------------------------
//#region GET

//--> estrapolazione tramite emai
export async function getUserByEmail(email) {
    try {
        const response = await User.findOne({ email });
        return response;
    } catch (error) {
        console.error("Errore estrapolazione tramite email", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }
};

//--> estrapolazione userName che iziano allo stesso modo
export async function getUserNamesByPrefix(userName) {
    try {
        const response = await User.find(
            { userName: { $regex: `^${userName}`, $options: "i" } },
            { userName: 1, _id: 0 }
        );
        return response;
    } catch (error) {
        console.error("Errore estrapolazione user con stesso prefisso", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }
};

//--> estrapolazione utenti tramite query
export async function getUserbyParams(query) {   

    const params = query;    
    const regexFields = ["firstName", "lastName", "email", "userName"];

    const pagination = query.pagination || {};
    const { page, limit, sort, sortDirection, skip } = pagination;

    //costruzione parametri 
    const queryParams = {}
    for (const [field, val] of Object.entries(params)) {
        if (regexFields.includes(field)) {
            queryParams[field] = {
                $regex: (field === "userName" ? `^${val}$` : val ),
                $options: "i"
            }
        } else {
            queryParams[field] = val;
        }
    }    

    //costruione chiamata
    let dbQuery = User.find(queryParams);
    

    //aggiungo eventuale paginazione alla chiamata
    if (Object.keys(pagination).length) {

        dbQuery = dbQuery
            .sort({ [sort]: sortDirection })
            .skip(skip)
            .limit(limit)
    }

    try {
        const response = await dbQuery;
        const total = await User.countDocuments(queryParams);

        return {
            ok: true,
            data: response,
            ...(Object.keys(pagination).length && {
                pagination: {
                    ...pagination,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalResult: total
                }
            })
        }

    } catch (error) {
        console.error("Errore ricerca utente", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }
};

//--> estrapolazione utente da id
export async function getUserById(user_id) {
    try {
        const response = await User.findById(user_id);
        return response;
    } catch (error) {
        console.error("Errore estrapolazione tramite _id", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }
};

//--> confronto password
export async function matchPassword(password, user_id) {
    try {


    } catch (error) {
        console.error("Errore comparazione password", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }


}
//#endregion

// --------------------------   PUT   -------------------------------------
//#region PUT

export async function saveUpdateUser(updateData) {

    const { _id, ...rest } = updateData

    try {
        //ricerca utente
        const user = await User.findById(_id);
        if (!user) {
            return {
                ok: false,
                error: {
                    code: "USER_FOUND",
                    reason: "invalid_id",
                    message: "Utente non trovato: id non valido"
                }
            }
        }

        //applico modifiche
        for (const[field, value] of Object.entries(rest)) {
            user[field] = value
        }

        //salvataggio
        const response = await user.save();

        //se password modificata nuova generazione token
        let token = null;
        if ("password" in rest) {
            token = await generateJWT({ id: user._id });
        }

        return {
            ok: true,
            data: response,
            ...(token ? { token } : {})
        }

    } catch (error) {
        console.error("Errore salvataggio modifica utente", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        }
    }
}
//#endregion
