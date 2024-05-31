import ProductManager from "./product.fs.manager.js";
import ProductManagerMongo from "./product.mongo.manager.js";
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"
import * as dotenv from 'dotenv';

let productDao = {}
//const messageDao = {}

// 1. FileSystem
// 2. Mongo

const selectedDao = 2

switch (selectedDao) {
    case 1:
        productDao = new ProductManager("../products.json")    
        //messageDao = new MessageManager()    
        break;

    case 2:
        productDao = new ProductManagerMongo()
        //messageDao = new MessageManagerMongo()
        break; 
    default:
        break;
}


//*********************************************************************// */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const SECRET="SANTIbel1003"
// export const creaHash=password=>crypto.createHmac("sha256",SECRET).update(password).digest("hex")
export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)

export default __dirname;
export {productDao}






dotenv.config();
    export const SECRET= process.env.MONGOPASSWORD
    export const EMAIL_USER = process.env.EMAIL_USER
    export const EMAIL_PASS = process.env.EMAIL_PASS




