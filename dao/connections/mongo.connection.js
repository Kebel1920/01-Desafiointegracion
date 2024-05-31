import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

//Singleton to connect Mongo DB
export class MongoConnection {
    constructor() {
        if (!MongoConnection.instance) {
            const uri = process.env.MONGOURL
            mongoose.set("strictQuery", false);
            mongoose.connect(uri, {dbName:"ecommerce"});
            MongoConnection.instance = this;
        }
        return MongoConnection.instance;
    }

    async connect() {
        try {
            mongoose.connection.on('open', () => {
                console.log("Mongo has been connected successfuly");
            });
        } catch (err) {
            console.log('Error connecting to MongoDB Atlas' + err);
        }
    }

    async disconnect() {
        console.log("Closing mongo Atlas");
        mongoose.connection.close()
    }
}

