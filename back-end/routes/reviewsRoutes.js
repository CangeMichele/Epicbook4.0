import express from "express";
import Review from "../models/Review.js";
import Book from "../models/Book.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// ----- Validatori
import { validateReviewCreate } from "../validators/review/validateReviewCreate.js";
import { validateReviewUpdate } from "../validators/review/validateReviewUpdate.js";
import { validateReviewQuery } from "../validators/review/validateReviewQuery.js";
import { reviewValidators } from "../validators/review/reviewValidators.js";
import { validateReviewDelete } from "../validators/review/validateReviewDelete.js";


const router = express.Router();

// --------------------------   POST   -----------------------------------

//-> creazione nuovo commento
router.post("/", authMiddleware, async (req, res) => {

    // recupero user id da middleware
    const user_id = req.user._id.toString();

    //popolo nuova recensione
    const newReviewData = {
        user_id: user_id,
        ...req.body
    };

    //eseguo validazione 
    const validationResult = validateReviewCreate(newReviewData);

    if (!validationResult.status) {
        return res.status(400).json({
            status: false,
            details: validationResult.details,
            message: validationResult.message,
            data: newReviewData
        })
    }

    const validatedReviewData = validationResult.data;

    try {

        //verifico esistenza libro
        const book = await Book.findOne({ asin: validatedReviewData.asin })
        if (!book) {
            return res.status(404).json({
                status: false,
                details: "asin_not_found",
                message: "Errore nuova recensione: nessuna corrispondenza ASIN",
                data: newReviewData
            })

        }
        const newReview = new Review(validatedReviewData);
        const savedReview = await newReview.save();

        //creo risposta
        const response = {
            status: true,
            data: savedReview,
            message: "Nuova recensione aggiunta con successo."
        }

        //gestisco warning
        if (validationResult.warning) {
            response.warning = true;
            response.warnings = validationResult.warnings;
        }

        return res.status(201).json(response);

    } catch (error) {
        // Gestione caso asin + user_id duplicati
        if (error.code === 11000) {
            return res.status(400).json({
                status: false,
                details: "duplicate_review",
                message: `Hai già inserito una recensione per questo libro. ${error}`,
                data: newReviewData
            });
        }

        // Altri errori interni
        return res.status(500).json({
            status: false,
            details: "internal_error",
            message: "Errore nuova recensione: " + error.message,
            data: newReviewData
        });
    }
});


// --------------------------   GET   --------------------------------------
// -> commenti con parametri
router.get("/", async (req, res) => {

    //eseguo validazione 
    const validationResult = validateReviewQuery(req.query);

    if (!validationResult.status) {
        return res.status(400).json({
            status: false,
            details: validationResult.details,
            message: validationResult.message,
            data: req.query
        })
    }

    const validatedReviewQuery = validationResult.data;

    try {
        //eseguo ricerca
        const reviews = await Review.find(validatedReviewQuery)
            .populate("user", "userName avatar_url");

        //creo risposta
        const response = {
            status: true,
            data: reviews.length === 0 ? validatedReviewQuery : reviews,
            message: reviews.length === 0
                ? "Nessun documento trovato"
                : reviews.length === 1
                    ? "1 documento trovato"
                    : `${reviews.length} documenti trovati`
        }

        //gestiosco warning
        if (validationResult.warning) {
            response.warning = true;
            response.warnings = validationResult.warnings;
        }

        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
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
    const updateReviewData = {
        user_id: user_id,
        asin: req.body.asin,
        rating: req.body.rating,
        comment: req.body.comment
    }

    //esegue validazione asin 
    const validatedAsin = reviewValidators["asin"](req.body.asin);
    if (!validatedAsin.status) {
        return res.status(400).json({
            status: false,
            details: validatedAsin.details,
            message: validatedAsin.message
        });
    }

    try {
        //verifico esistenza commento
        const dbReviewData = await Review.findOne({ asin: validatedAsin.value, user_id: user_id });
        if (!dbReviewData) {
            return res.status(404).json({
                status: false,
                details: "review_not_found",
                message: "Nessuna corrispondenza trovata fra asin e user"
            })
        }

        //eseguo confronto e validazione 
        const validationResult = validateReviewUpdate(dbReviewData, updateReviewData);

        if (!validationResult.status) {
            return res.status(400).json({
                status: false,
                details: validationResult.details,
                message: validationResult.message
            })
        }

        if (validationResult.details === "update_missing") {
            return res.status(200).json(validationResult);
        }

        // aggiorno documento
        Object.assign(dbReviewData, validationResult.data);
        const updatedReview = await dbReviewData.save();

        //creo risposta
        const response = {
            status: true,
            data: updatedReview,
            message: "Aggiornamento effettuato con successo."
        }

        //gestisco warning
        if (validationResult.warning) {
            response.warning = true;
            response.warnings = validationResult.warnings;
        }

        return res.status(200).json(response);

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

    //NOTE:
    // asin + user_id = parametri da front-end
    // review_id = parametro per debug/testing

    const validationResult = validateReviewDelete(req.body)

    if (!validationResult.status) {
        return res.status(400).json(validationResult);
    }

    //recupero dati parametri validati
    const { asin, review_id } = validationResult.data;
    // recupero user_id da middleware
    const user_id = req.user._id.toString();

    //popolo parametri ricerca
    const params = review_id
        ? { review_id }
        : { asin, user_id }

    try {

        //procedo con eliminazione
        const deletedReview = await Review.findOneAndDelete(params);

        if (!deletedReview) {
            return res.status(404).json({
                status: false,
                details: "review_not_found",
                message: "Nessuna corrispondenza trovata",
                data: params
            })
        }

        return res.status(200).json({
            status: true,
            message: "Recensione eliminata con successo",
            data: {
                review_id: deletedReview._id,
                asin: deletedReview.asin,
                user_id: deletedReview.user_id
            },
             ...(validationResult.warning && validationResult.warnings
                ? { warning: true, warnings: validationResult.warnings }
                : {}
            )
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
