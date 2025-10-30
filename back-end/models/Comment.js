import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        asin: {
            type: String,
            required: true,
            unique: true
        },
        userID:{
            type:String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
        comment:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            enum:[1,2,3,4,5],
            required:true
        }
    },

    {
        collection:"comments"
    }
);

const Comment = model("Comment", commentSchema);

export default Comment;