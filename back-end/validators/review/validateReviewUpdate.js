// *** CONTROLLO DATI PER PUT ***

import { reviewValidators } from "./reviewValidators.js";

export function validateReviewUpdate(oldData, updateData) {

    //lista campi modificabili
    const allowedFields = ["comment", "rating"];

    //lista campi da ignorare (presenti in updateData ma non modificabil)
    const immutableFields = ["user_id", "asin"]

    //dati validati
    const validatedUpdateData = {};

    //lista warning
    const warnings = {};

    //ciclo i nuovi dati, confronto con quelli vecchi e applcio i controlli
    for (const [field, value] of Object.entries(updateData)) {

        //se dato ha valore
        if (value !== undefined) {

            //se campo non aggiornabile
            if (immutableFields.includes(field)) continue;

            //se campo non previsto aggiungo warning list e ignora 
            if (!allowedFields.includes(field)) {
                warnings[field] = {
                    details: `not_updatable`,
                    message: `Campo ${field} non aggiornabile.`
                };
                continue;
            }

            //applico validazione
            const validationResult = reviewValidators[field](value);

            //se errore blocca e restituisci 
            if (!validationResult.status) return validationResult;

            //se dato uguale ignora
            if (oldData[field] === validationResult.value) continue;

            // se modificato aggiungi
            validatedUpdateData[field] = validationResult.value;
        }
    }

    //se nessun campo validato segnalo come warning
    if (Object.keys(validatedUpdateData).length === 0) {
        return {
            status: true,
            warning: true,
            details: "update_missing",
            message: "Nessun dato da aggiornare"
        }
    }
}

//se non si è bloccato prima, dati non validi
return {
    status: true,
    data: validatedUpdateData,
    ...(Object.keys(warnings).length > 0
        ? { warning: true, warnings: warnings }
        : {}
    )
};


