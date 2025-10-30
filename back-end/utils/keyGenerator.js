// ----- CREAZIONE JWT

// generatore di chiavi segrete per JWT
import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'));

// assicurarsi di essere nella giusta directory e lanciare da terminale
// node KeyGenerator.js
// dopo di che copiare la stringa ottenuta