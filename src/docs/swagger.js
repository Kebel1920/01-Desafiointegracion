import express from 'express';
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from"swagger-ui-express"
import dotenv from 'dotenv'
import { router as productRouter} from '../dao/router/product.Router.js';
import { MongoConnection} from '../dao/connections/mongo.connection.js';


dotenv.config ();
const app = express();

const MongoConnectionInstance = new MongoConnection ();
MongoConnectionInstance.connect();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Products",
            version: "1.0.0",
            description: "Documentación del proyecto ecommerce productos"
        },
    },
    apis: ["./docs/*.yaml"]
}
const spec = swaggerJsdoc(options)


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use ('/products', productRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec))


const port = 8080;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
