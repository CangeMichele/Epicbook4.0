import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar_url: {
            type: String,
            required: true,
        },
        avatar_id: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true,
        collection: "users"
    }
);

// comparatore password (confronta inserita con quella hashata nel DB)
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

// MIDDLEWARE hashing password prima del salvataggio nel DB
userSchema.pre("save", async function (next) {
    //se già presente vai avanti
    if (!this.isModified("password")) return next();

    //altrimenti procedi con hash password
    try {
        const salt = await bcrypt.genSalt(10); // esegue 10 round di hashing
        this.password = await bcrypt.hash(this.password, salt);

        next();

    } catch (error) {
        next(error);
    }
})


const User = model("User", userSchema);
export default User;
