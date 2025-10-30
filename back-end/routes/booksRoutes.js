import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// ----- GET/books => Estrapolazione di tutti i libri
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);

    } catch (err) {
        res.status(500).json({message: err.message})
    }
});


// ---- GET/books/:category => Estrapolazione libri per categoria
router.get("/:category", async(req, res) =>{
 try {
    const {category} = req.params;
    const books = await Book.find({category});
    res.json(books);
    if( books.lenght == 0 ){
        req.status(400).json({message: `nessuna risorsa trovata per ${category}` })
    }

 } catch (error) {
    res.status(500).json({message: error.message})
 }   
})


//----- GET libri per categoria con impaginazione


//----- GET/details/:asin => Estrapolazione libro tramite asin
router.get("/details/:asin", async(req, res) => {
    try {
        const book = await Book.findOne({asin: req.params.asin});
        if (!book) {
            return req.status(400).json({message: "libro non trovato"})
        }
        res.json(book);
        
    } catch (err) {
        res.status(500).json({message: err.message});
        
    }
})


export default router;
