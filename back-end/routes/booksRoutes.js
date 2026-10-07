import express from "express";
// ---- services
import { getBooks } from "../services/action/book/getBooks.js";
import errorStatusMap from "../utils/errorStatusMap.js"
const router = express.Router();

// --------------------------   GET   --------------------------------------
//#region GET

// -> ricerca libri per parametri
router.get("/", async (req, res) => {

    try {
        const result = await getBooks(req.query);
        if (!result.ok) {
            const status = errorStatusMap[result.error.code] || 500;
            return res.status(status).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "books_query_server",
                message: error.message
            }
        });
    }

});


//#endregion

export default router;
