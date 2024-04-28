import mongoose from "mongoose";

export const rolModel=mongoose.model(
    "roles",
    new mongoose.Schema(
        {
         descrip:String   
        },
        {timestamps:true, collection: "roles"}
    )
)