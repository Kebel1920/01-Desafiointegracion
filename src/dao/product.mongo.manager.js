import { MongoConnection } from "./connections/mongo.connection.js";
import { MongoProduct } from "./models/mongo.models.js";


export default class ProductManagerMongo {
    constructor() {
        new MongoConnection().connect()
    }


    async addProduct(product) {
       return await MongoProduct.create(product)
    }

    async getProduct() {

        return await MongoProduct.find().lean();
    }



    async getProductsById(id) {
        return await MongoProduct.findById(id).lean()
    }

    async updateProduct (id, data)  {
        try {

            let upt = await MongoProduct.updateOne({ _id: id }, data);
            if (upt.modifiedCount) return await this.getProductById(id);

        } catch (error) {
            return false;
        }
    }

    async deleteProduct(id) {
        let response = {};
        let del = await MongoProduct.deleteOne({ _id: id });
        if (del.deletedCount >= 1) {
            response.error = 0,
            response.message = `The product with id: ${id} has been deleted`;
        } else {
            response.error = 1;
            response.message = "Task could not be completed, product not found";
        }
        return response;
    }
}



