import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        firstName:{
            type: String,
            required: true,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        birthDate:{
            type:Date,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            trim:true
        },      
        avatar_url:{
            type:String,
            required:true,
            trim:true
        },
        avatar_id:{
            type:String,
            required:true,
            trim:true
        },
        userName:{
            type:String,
            required:true,
            unique:true,
            trim:true
        } 

    },
    {
        collection: "users"
    }
);

// comparatore password (confronta inserita con quella hashata nel DB)
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

//hashing password prima del salvataggio nel DB
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})


const User = model("User", userSchema);
export default User;
