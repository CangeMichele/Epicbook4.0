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

const Review = model("Review", reviewSchema);

export default Review;