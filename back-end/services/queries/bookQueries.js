//*** QUERY PER  BOOKS ***

import Book from "../../models/Book.js";

// --------------------------   GET   --------------------------------------

//--> estrapolazione tramite query
export async function getBooksbyParams(query) {
    //estrapolazione dati
    const { page, limit, sort, sortDirection, ...rest } = query;
    const params = rest;
    const pagination = {
        ...(page && { page }),
        ...(limit && { limit }),
        ...(sort && { sort }),
        ...(sortDirection && { sortDirection }),
    }

    const queryParams = {}

    //costruzione parametri 
    for (const [field, val] of Object.entries(params)) {
        queryParams[field] = {
            $regex: val,
            $options: "i"
        }
    }

    //costruione chiamata
    let dbQuery = Book.find(queryParams);

    //aggiungo eventuale paginazione alla chiamata
    if (Object.keys(pagination).length) {

        dbQuery = dbQuery
            .limit(limit || 10)
            .sort({
                [sort || "createdAt"]: sortDirection || 1
            })
            .skip(
                ((page - 1) * limit) || 0
            )
    }

    try {
        //chiamata DB
        const response = await dbQuery;
        //totali risultati trovati
        const total = await Book.countDocuments(queryParams);

        return {
            ok: true,
            data: response,
            ...(Object.keys(pagination).length && {
                pagination: {
                    ...pagination,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalResults: total
                }
            })
        }

    } catch (error) {
        console.error("Errore ricerca libri", error);
        return {
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "book_query_server",
                message: error.message
            }
        }
    }
}