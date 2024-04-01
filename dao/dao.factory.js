import ProductManager from "./product.fs.manager.js";
import ProductManagerMongo from "./product.mongo.manager.js";

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

export {productDao}