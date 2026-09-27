// *** CONTROLLO E SANITIZZAZIONE DATI PER TYPE ***

// ----- STRINGHE -----
export function stringValidator(field, value, transforms = []) {
    //controllo presenza valore
    if (value == null) {
        return {
            reason: "empty",
            message: "Campo vuoto.",
            details: { field }
        };
    }

    //controllo type dato
    if (typeof value !== "string") {
        return {
            reason: "invalid_type",
            message: "Non valido.",
            details: { field, value }
        };
    }

    //normalizzazione dati
    let sanitized = value.trim();

    //nuovo controllo presenza valore
    if (sanitized === "") {
        return {
            reason: "empty",
            message: "Campo vuoto.",
            details: { field }
        };
    }

    //esegue istruzioni se presenti in array di trasformazione
    if (transforms?.length) {
        //esegue ogni funzione di transofrm su sanitazed
        for (const fn of transforms) {
            sanitized = fn(sanitized);
        }
    }

    //restituisco stringa controllata e pulita
    return { value: sanitized };
};

// ----- NUMERICO INTERO -----
export function integerNumberValidator(field, value) {

    //controllo presenza valore
    if (value == null) {
        return {
            reason: "empty",
            message: "Campo vuoto.",
            details: { field }
        };
    }

    //accetto solo numeri interi o stringhe (per tentativo conversione)
    if (typeof value !== "string" && typeof value !== "number") {
        return {
            reason: "invalid_type",
            message: "Campo non valido.",
            details: { field, value }
        };
    }

    let numericValue = value;

    //se stringa
    if (typeof value === "string") {
        const trimmed = value.trim();

        //controllo prensenza valore
        if (trimmed === "") {
            return {
                reason: "empty",
                message: "Campo vuoto.",
                details: { field }
            };
        }

        //coversione stringa
        numericValue = Number(trimmed);
    }

    //controllo se numero
    if (Number.isNaN(numericValue)) {
        return {
            reason: "invalid_number",
            message: "Valore non numerico.",
            details: { ield, value }
        };
    }

    //controllo se numero intero
    if (!Number.isInteger(numericValue)) {
        return {
            reason: "invalid_integer",
            message: "Valore numerico non valido.",
            details: { field, value }
        };
    }

    //restituisco numero valido
    return { value: numericValue };
};

// ----- DATA -----
export function dateValidator(field, value) {
    //controllo presenza valore
    if (value == null) {
        return {
            reason: "empty",
            message: `Parametro ${field} assente.`,
            details: { field }
        };
    }

    //variabile manipolazione data
    let parsedDate;

    //controllo se value è un Date type
    if (value instanceof Date) {
        parsedDate = value;
    } else {
        //altimenti lo converte
        parsedDate = new Date(value);
    }

    //utilizzo getTime() per controllare se parseDate è reamente un Date type
    if (isNaN(parsedDate.getTime())) {
        return {
            reason: "invalid_date",
            message: `Parametro ${field} non è una data.`,
            details: { field, value }
        }
    }

    //evito correzione automatica JS se converte una stringa con data non congrua (es. 2026-15-45)
    if (typeof value === "string") {
        const isoInput = value;
        const isoParsed = parsedDate.toISOString().slice(0, 10);
        console.log("isoInput: ", isoInput);
        console.log("isoParsed: ", isoParsed);
        

        if (isoInput !== isoParsed) {
            return {
                reason: "invalid_date_format",
                message: `Parametro ${field} non contiene una data valida.`,
                details: { field, value }
            }
        }
    }

    //controllo se data nel futuro
    const now = new Date();
    if (parsedDate > now) {
        return {
            reason: "future_date",
            message: `Parametro ${field} non può essere nel futuro.`,
            details: { field, value }
        };
    }

    //controllo se data troppo vecchia (minore 1900)
    const minYear = 1900;
    if (parsedDate.getFullYear() < minYear) {
        return {
            reason: "date_too_old",
            message: `Parametro ${field} è una data precedente a ${minYear}.`,
            details: { field, value, minYear }
        };
    }

    return { value: parsedDate }
};

// ----- EMAIL -----
export function emailValidator(field, value) {

    //sanitizzo la stringa
    const transforms = [(v) => v.toLowerCase()]
    const result = stringValidator(
        field,
        value,
        transforms
    );

    if (!("value" in result)) return result
    const sanitized = result.value;

    //controllo lunghezza massima
    if (sanitized.length > 254) {
        return {
            reason: "too_long",
            message: `Parametro ${field} troppo. Lunghezza massima 254 caratteri.`,
            details: { field, value, length: sanitized.length }
        };
    }

    //verifica presenza di @ e di almento un . successivo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
        return {
            reason: "invalid_email",
            message: "Email non valida",
            details: { field, value }
        };
    }

    //restitutisco email valida
    return { value: sanitized };
};

// ----- NUOVA PASSWORD -----
export function newPasswordValidator(password, rules) {
   console.log("password: ", password);
   
    //verifica password come stringha
    const result = stringValidator("password", password);
    if (!("value" in result)) {
        delete result.details.value;//elimina valore password dai dettagli errore
        return result
    }
    const stringPsw = result.value;
    //verifica presenza condizioni
    if (!rules?.length) {
        return {
            reason: "empty",
            message: "Criteri di sicurezza password assenti.",
            details: { field: "password" }
        }
    }

    //verifico criteri sicurezza su referenza
    for (const rule of rules) {
        const RulesRes = rule.fn(stringPsw);
        if (!RulesRes) {
            return {
                reason: "invalid_password",
                message: "La password non rispetta i criteri minimi di sicurezza.",
                details: {
                    field: "password",
                    failedRule: rule.name
                }
            }
        }
    }

    //restituisco password pulita 
    return { value: result.value }

};



// -------------------- UTILITA' --------------------
//#region utils

// Prima lettera maiuscola
function capitalizeWords(string) {
    return string
        .split(/\s+/) //dividi ogni vuoto (uno o più spazi)
        .map(word =>
            word.charAt(0).toUpperCase() //prima lettera maiuscola
            + word.slice(1).toLowerCase() //tutto il resto minuscolo
        )
        .join(" "); // restituisce stringa
};

// --> export wrapper
export const utils = {
    capitalizeWords,
}

//#endregion

