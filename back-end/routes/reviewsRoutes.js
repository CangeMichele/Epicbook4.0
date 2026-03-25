import express from "express";
import Review from "../models/Review.js";
import Book from "../models/Book.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// ----- Validatori
import { validateReviewCreate } from "../validators/validateReviewCreate.js";
import { validateReviewUpdate } from "../validators/validateRevieUpdate.js";
import { validateReviewQuery } from "../validators/validateReviewQuery.js";
import { reviewValidators } from "./reviewValidators";


const router = express.Router();

// --------------------------   POST   -----------------------------------

//-> creazione nuovo commento
router.post("/", authMiddleware, async (req, res) => {

    // recupero user id da middleware
    const user_id = req.user._id.toString();

    //popolo nuova recensione
    const newReviewData = {
        user_id: user_id,
        asin: req.body.asin,
        rating: req.body.rating,
        comment: req.body.comment
    };

    //eseguo validazione 
    const validationRes = validateReviewCreate(newReviewData);
    if (!validationRes.status) {
        return res.status(400).json({
            status: false,
            details: validationRes.details,
            message: validationRes.message
        })
    }

    const validatedReviewData = validationRes.data;

    //verifico esistenza libro
    const book = await Book.findOne({ asin: validatedReviewData.asin })
    if (!book) {
        return res.status(404).json({
            status: false,
            details: "asin_not_found",
            message: "Errore nuova recensione: nessuna corrispondenza ASIN"
        })
    }

    //salvataggio nel DB
    try {
        const newReview = new Review(validatedReviewData);
        const savedReview = await newReview.save();

        return res.status(201).json({
            status: true,
            data: savedReview,
            message: "Nuova recensione aggiunta con successo."
        });

    } catch (error) {
        // Gestione caso asin + user_id duplicati
        if (error.code === 11000) {
            return res.status(400).json({
                status: false,
                details: "duplicate_review",
                message: "Hai già inserito una recensione per questo libro"
            });
        }

        // Altri errori interni
        return res.status(500).json({
            status: false,
            details: "internal_error",
            message: "Errore nuova recensione: " + error.message
        });
    }
});


// --------------------------   GET   --------------------------------------
// -> commenti con parametri
router.get("/", async (req, res) => {

    const validationRes = validateReviewQuery(req.query);

    if (!validationRes.status) {
        return res.status(400).json({
            status: false,
            details: validationRes.details,
            message: validationRes.message
        })
    }

    const validatedReviewQuery = validationRes.data;

    try {
        const reviews = await Review.find(validatedReviewQuery);
        return res.json({
            status: true,
            data: reviews,
            message: "Documenti trovati."
        });

    } catch (error) {
        return res.status(404).json({
            status: false,
            details: "internal_error",
            message: "Errore ricerca recensione: " + error.message
        });
    }
});

// --------------------------   PUT   -------------------------------------

// -> aggiorna commento
router.put("/", authMiddleware, async (req, res) => {

    // recupero user id da middleware
    const user_id = req.user._id.toString();

    //recupero dati update
    const updateData = {
        user_id: user_id,
        asin: req.body.asin,
        rating: req.body.rating,
        comment: req.body.comment
    }

    //esegue validazione asin 
    const validatedAsin = reviewValidators["asin"](req.body.asin);
    if (!validatedAsin.status)
        return res.status(400).json({
            status: false,
            details: validatedAsin.details,
            message: validatedAsin.message
        });

    //verifico esistenza commento
    const dbReview = await Review.findOne({ asin: validatedAsin.value, user_id: user_id });
    if (!dbReview) {
        return res.status(404).json({
            status: false,
            details: "review_not_found",
            message: "Nessuna corrispondenza trovata asin + user"
        })
    }

    //eseguo confronto e validazione 
    const validationRes = validateReviewUpdate(dbReview, updateData);
    if (!validationRes.status) {
        return res.status(400).json({
            status: false,
            details: validationRes.details,
            message: validationRes.message
        })
    }

    try {
        // aggiorno documento
        Object.assign(dbReview, validationRes.data);
        const updatedReview = await dbReview.save();

        if (validationRes.warning) {
            return res.status(200).json({
                status: true,
                data: updatedReview,
                details: validationRes.details,
                message: `WARNING: ${validationRes.message}`
            });
        }

        return res.status(200).json({
            status: true,
            data: updatedReview,
            message: "Aggiornamento effettuato con successo."
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            details: "internal_error",
            message: "Errore update recensione: " + error.message
        });
    }
});

// --------------------------   DELETE   --------------------------------------

// -> cancellazione commento
router.delete("/", authMiddleware, async (req, res) => {

    // recupero user id da middleware
    const user_id = req.user._id.toString();

    //esegue validazione asin 
    const validatedAsin = reviewValidators["asin"](req.body.asin);
    if (!validatedAsin.status)
        return res.status(400).json({
            status: false,
            details: validatedAsin.details,
            message: validatedAsin.message
        });

    //verifico esistenza commento
    const dbReview = await Review.findOne({ asin: validatedAsin.value, user_id: user_id });
    if (!dbReview) {
        return res.status(404).json({
            status: false,
            details: "review_not_found",
            message: "Nessuna corrispondenza trovata asin + user"
        })
    }

    try {
        //procedo con eliminazione 
        await Review.findByIdAndDelete(dbReview._id)
        return res.status(200).json({
            status: true,
            data: dbReview,
            message: "Recensione eliminata con successo"
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            details: "internal_error",
            message: "Errore eliminazione recensione: " + error.message
        });
    }

});

export default router;
