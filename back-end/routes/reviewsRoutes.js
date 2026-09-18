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

    //NOTE: user_id già valido perchè preso da middleware

    //eseguo validazione 
    const validationResult = validateReviewCreate(req.body);

    if (!validationResult.ok) {
        return res.status(400).json({
            validationResult
        })
    }

    const validatedReviewData = validationResult.data;
    const reviewWarnings = validationResult.warnings;

    try {
        const asin = validatedReviewData.asin;

        //verifico esistenza libro
        const book = await Book.findOne({ asin })
        if (!book) {
            return res.status(404).json({
                ok: false,
                error: {
                    code: "RESOURCE_NOT_FOUND",
                    context:"review",
                    reason: "asin_not_found",
                    message: "Errore nuova recensione: nessuna corrispondenza ASIN",
                    details: { asin }
                }
            })

        }

        //verifico se già inserio
        const existing = await Review.findOne({ asin, user_id });

        if (existing) {
            return res.status(409).json({
                ok: false,
                error: {
                    code: "CONFLICT",
                    context:"review",
                    reason: "duplicate_review",
                    message: "Hai già inserito una recensione per questo libro.",
                    details: {
                        asin: asin,
                        user_id: user_id,
                        review_id: existing._id
                    }
                }
            });
        }

        //se nuovo procedo al salvataggio
        const newReview = new Review(validatedReviewData);
        const savedReview = await newReview.save();

        //invio risposta
        return res.status(201).json({
            ok: true,
            context:"review",
            data: savedReview,
            message: "Nuova recensione aggiunta con successo.",
            ...(reviewWarnings
                && Object.keys(reviewWarnings).length > 0
                && { warnings: reviewWarnings })
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                code: "INTERNAL_ERROR",
                context:"review",
                reason: "internal_error",
                message: "Errore creazione nuova recensione: " + error.message,
                details: { attempted: req.body }
            },
        });
    }
});


// --------------------------   GET   --------------------------------------
// -> commenti con parametri
router.get("/", async (req, res) => {

    //eseguo validazione 
    const validationResult = validateReviewQuery(req.query);

    if (!validationResult.ok) {
        return res.status(400).json({
            validationResult
        })
    }

    const validatedReviewQuery = validationResult.data;
    const reviewWarnings = validationResult.warnings;

    try {
        //eseguo ricerca
        const reviews = await Review.find(validatedReviewQuery)
            .populate("user", "userName avatar_url"); //aggiungo dati da schema user per UIX

        return res.status(200).json({
            ok: true,
            context:"review",
            data: reviews.length === 0 ? [] : reviews,
            message: reviews.length === 0
                ? "Nessun documento trovato"
                : reviews.length === 1
                    ? "1 documento trovato"
                    : `${reviews.length} documenti trovati`,
            ...(Object.keys(reviewWarnings).length > 0
                && { warnings: reviewWarnings })
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                code: "INTERNAL_ERROR",
                context:"review",
                reason: "internal_error",
                message: "Errore ricrerca recensione: " + error.message,
                details: { attempted: req.body }
            },
        });
    }
});

// --------------------------   PUT   -------------------------------------

// -> aggiorna commento
router.put("/", authMiddleware, async (req, res) => {

    // recupero user_id da middleware
    const user_id = req.user._id.toString();

    //eseguo validazione 
    const validationResult = validateReviewUpdate(req.body);

    //se validazione non andata a buo fine
    if (!validationResult.ok) {
        return res.status(400).json({
            validationResult
        })
    }

    //se validazione non ha prodotto dati utilizzabili
    if (validationResult.meta?.code === "NO_CHANGE") {
        return res.status(200).json(validationResult)
    }

    const { asin, review_id, ...changedReviewData } = validationResult.data;

    //popolo parametri
    const params = {
        ...(asin && user_id && { asin, user_id }),
        ...(review_id && { review_id })
    };

    const hasCombination = "asin" in params && "user_id" in params;
    const hasReview_id = "review_id" in params;

    //errore se mancano parametri ricerca
    if (!hasCombination && !hasReview_id) {
        return res.status(400).json({
            ok: false,
            error: {
                code: "ERROR_PARAMS",
                context:"review",
                reason: "empty_params",
                message: "Nessun parametro di ricerca valido. Inserire review_id OPPURE asin",
                details: { attempted: req.body }
            }
        });
    }

    try {
        //recupero commento
        const dbReviewData = await Review.findOne(params);
        if (!dbReviewData) {
            return res.status(404).json({
                ok: false,
                error: {
                    code: "RESEARCH_ERROR",
                    context:"review",
                    reason: "empty_research",
                    message: "Nessuna corrispondenza trovata per parametri di ricerca",
                    details: { params }
                }
            })
        }

        const updateReviewData = {};
        //comparazione dati da ggiornare
        for (const [field, value] of Object.entries(changedReviewData)) {

            //protezione da undefined
            if (value === undefined) continue;
            //se uguale ignora
            if (dbReviewData[field] === value) continue;
            //aggiungi ad aggiornamenti
            updateReviewData[field] = value;

        }

        //se non ci sono dati da aggiornare
        if (Object.keys(updateReviewData).length === 0) {
            return res.status(200).json({
                ok: true,
                context:"review",
                data: {},
                meta: {
                    code: "NO_CHANGE",
                    reason: "empty_update",
                    message: "Nessun cambiamento rilevato. Risorsa immutata",
                    details: { attempted: req.body }
                },
                ...(validationResult.warnings && { warnings: validationResult.warnings })

            })
        }

        // aggiorno documento
        Object.assign(dbReviewData, updateReviewData);
        const savedReview = await dbReviewData.save();

        return res.status(200).json({
            ok: true,
            context:"review",
            data: savedReview,
            message: "Aggiornamento effettuato con successo.",
            ...(validationResult.warnings && { warnings: validationResult.warnings })

        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            context:"review",
            error: {
                code: "INTERNAL_ERROR",
                reason: "internal_error",
                message: "Errore aggiornamento recensione: " + error.message,
                details: { attempted: req.body }
            },
        });
    }
});

// --------------------------   DELETE   --------------------------------------

// -> cancellazione commento
router.delete("/", authMiddleware, async (req, res) => {

    //NOTE:
    // asin + user_id = parametri da front-end
    // review_id = parametro per debug/testing

    const validationResult = validateReviewDelete(req.query)

    if (!validationResult.ok) {
        return res.status(400).json(validationResult);
    }

    //recupero dati parametri validati
    const { asin, review_id } = validationResult.data;

    // recupero dati da middleware
    const user_id = req.user._id.toString();

    //popolo parametri
    const params = {
        ...(asin && user_id && { asin, user_id }),
        ...(review_id && { review_id })
    };

    try {
        //procedo con eliminazione
        const deletedReview = await Review.findOneAndDelete(params);

        if (!deletedReview) {
            return res.status(404).json({
                ok: false,
                error: {
                    code: "RESEARCH_ERROR",
                    reason: "empty_research",
                    message: "Nessuna corrispondenza trovata per parametri di ricerca",
                    details: { params }
                }
            })
        }

        return res.status(200).json({
            ok: true,
            message: "Recensione eliminata con successo",
            data: { deletedReview },
            ...(validationResult.warnings && { warnings: validationResult.warnings })
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                code: "INTERNAL_ERROR",
                reason: "internal_error",
                message: "Errore eliminazione recensione: " + error.message,
                details: { attempted: req.body }
            },
        });
    }

});

export default router;
