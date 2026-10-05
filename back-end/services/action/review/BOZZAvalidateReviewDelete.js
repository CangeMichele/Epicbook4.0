// *** CONTROLLO PARAMETRI PER DELETE ***

import { reviewValidators } from "./reviewValidators.js";

export function validateReviewDelete(toDelete) {

    //parametri consentiti
    const allowedParams = ["asin", "review_id"];

    //lista warning
    const warnings = {};

    //parametri validati
    const validatedParams = {}

    //cilco per vede se campi consetiti
    for (const [field, value] of Object.entries(toDelete)) {

        //se parametro non consentito aggiunge a warning list e ignora 
        if (!allowedParams.includes(field)) {
            warnings[field] = {
                reason: "not_allowed_field",
                message: `${field} non valido come parametro eliminazione.`,              
                value                
            };
            continue;
        }
        
        //verifico esistenza validatore
        const validator = reviewValidators[field];
        if (!validator) {
            return {
                ok: false,
                error: {
                    context:"review",
                    code: "SCHEMA_ERROR",
                    reason: "missing_validator",
                    message: `Nessuna validazione possibile per campo ${field}`,
                    details: { field },
                },
            }
        }

        //eseguo validazione
        const validationResult = validator(toDelete[field]);

        // se errore in validazione
        if (!("value" in validationResult)) {
            return {
                ok: false,
                error: {
                    context:"review",
                    code: "VALIDATION_ERROR",
                    ...validationResult
                }
            }
        }

        //aggiungo a parametri validati
        validatedParams[field] = value;
    }

    //restituisco paramentri validati
    if(!Object.keys(validatedParams).length){
        return {
            ok: false,
                error: {
                    context:"review",
                    code: "VALIDATION_ERROR",
                    reason:"empty_params",
                    message:"Nessun parametro validato",
                    details:{
                        attempted:toDelete,
                        validated:{},
                        ...(warnings && { warnings })
                    }
                }
        }
    }

    //se validazione a buon fine
    return {
            ok: true,
            context:"review",
            data:  validatedParams,
         ...(warnings && { warnings })
        }    
 };











// SPOSTARE SUL LATO BUSINES !!!!!!!!!!







//     //NOTE: l'elimnazione è consentita solo tramite review_id o la combinazione 
//     // asin + user_id (preso dal middlware). Non è consentito l'uso di entrambi i metodi.

//     //blocca se presente asin + review
//     if (hasAsin && hasReview_id) {
//         return {
//             ok: false,
//             error: {
//                 code: "VALIDATION_ERROR",
//                 context:"review",
//                 reason: "params_conflict",
//                 message: "Conflitto parametri univoci. Scegliere asin o review_id",
//                 details: {
//                     asin: toDelete.asin,
//                     review_id: toDelete.review_id
//                 }
//             }
//         }
//     }

//     // validazione 
//     if (hasReview_id || hasAsin) {
//         const fieldToValidate = hasReview_id ? "review_id" : "asin"
        
//         //controllo presenza validatore 
//         const validator = reviewValidators[fieldToValidate];
        
//         if (!validator) {
//             return {
//                 ok: false,
//                 error: {
//                     code: "SCHEMA_ERROR",
//                     context:"review",
//                     reason: "missing_validator",
//                     message: `Nessuna validazione possibile per campo ${fieldToValidate}`,
//                     details: { field: fieldToValidate },
//                 },
//             }
//         }

//         //eseguo validazione
//         const validationResult = validator(toDelete[fieldToValidate]);

//         // se errore in validazione
//         if (!("value" in validationResult)) {
//             return {
//                 ok: false,
//                 error: {
//                     code: "VALIDATION_ERROR",
//                     context:"review",
//                     ...validationResult
//                 }
//             }
//         }

//         //se validazione a buon fine
//         return {
//             ok: true,
//             context:"review",
//             data: { [fieldToValidate]: validationResult.value },
//             ...(Object.keys(warnings).length > 0 && { warnings })
//         }

//     }

//     //se non  prima allora parametri mancanti
//     return {
//         ok: false,
//         error: {
//             code: "VALIDATION_ERROR",
//             context:"review",
//             reason: "required_params_empty",
//             message: "Nessun parametro valido. Inserire asin o review_id",
//             details: {
//                 attempted: toDelete
//             }
//         }
//     }
// }