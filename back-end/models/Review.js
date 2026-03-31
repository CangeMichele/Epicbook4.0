import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
    {
        asin: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true,
            maxLength: [500, "Lunghezza massima 500 caratteri"]
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: true
        }
    },

    {
        timestamps: true,
        collection: "reviews"
    }
);

// recensione univoco: uno specifico asin per uno specifico user
reviewSchema.index({ asin: 1, user_id: 1 }, { unique: true });

//collegamento allo schema User per estrapolare dati utente 
reviewSchema.virtual("user", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true
});


// abilito e pulisco dati toJson per virtual
reviewSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,  // rimuove __v
    transform: (doc, ret) => {
        delete ret.id;      // rimuove il campo id duplicato
    }
});

// abilito dati toObject per virtual
reviewSchema.set("toObject", { virtuals: true });


const Review = model("Review", reviewSchema);

export default Review;