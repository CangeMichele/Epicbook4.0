import express from "express";
import endpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


import booksRoutes from "./routes/booksRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MONGODB: connesso"))
.catch((err) => console.error("MONGODB: ERRORE - ", err));

app.use("/api/books", booksRoutes); //libri nel DB
app.use("/api/users", usersRoutes); //utenti nel DB
app.use("/api/auth", authRoutes); //autenticazione


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server acceso alla porta ${PORT}`);
    console.log("Sono disponibli i seguenti end points");
    console.table(endpoints(app));

});
