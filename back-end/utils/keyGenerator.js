// ----- CREAZIONE JWT

// generatore di chiavi segrete per JWT
import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'));

//eseguire in terminale. Recuperare stinga ottenuta 