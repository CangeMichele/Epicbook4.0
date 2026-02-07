import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// --------------------------   GET   --------------------------------------
//#region GET

//----- GET/books => Estrapolazione di tutti i libri con filtri e impaginazione 
router.get("/", async (req, res) => {
    try {
        // elementi per impaginazioni
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const allowedSort = ["asin", "title", "price"];
        const sort = allowedSort.includes(req.query.sort) ? req.query.sort : "asin";

        const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
        const skip = (page - 1) * limit;

        //lista di filtri  consentiti 
        const allowedFilters = ["category"];
        
        //cerca e aggiungi filtri (N.B. se filter vuoto allora tutti i libri)
        const filter = Object.fromEntries(
            Object.entries(req.query).filter(([key]) => allowedFilters.includes(key))
        );

        const books = await Book.find(filter)
            .sort({ [sort]: sortDirection })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(filter);

        res.json({
            books: books || [],
            totalPages: Math.ceil(total / limit),
            totalBooks: total,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})


//----- GET/details/:asin => Estrapolazione libro tramite asin
router.get("/:asin", async (req, res) => {
    try {
        const book = await Book.findOne({ asin: req.params.asin });
        if (!book) {
            return res.status(404).json({ message: "libro non trovato" })
        }
        res.json(book);

    } catch (err) {
        res.status(500).json({ message: err.message });

    }
})
//#endregion

export default router;
