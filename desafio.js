import fs from 'fs';

export default class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveProducts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

        const id = this.generateUniqueId();
        const newProduct = { id, title, description, price, thumbnail, code, stock };

        this.products.push(newProduct);
        this.saveProducts();

        return newProduct;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        return product;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(index, 1);
        this.saveProducts();
    }

    generateUniqueId() {
        return (this.products.length + 1).toString().padStart(3, '0');
    }
}

// // Crear una instancia de la clase ProductManager
// const productManager = new ProductManager('products.json');

// // Llamar a getProducts (debe devolver un arreglo vacío)
// console.log(productManager.getProducts());

// // Llamar a addProduct con un nuevo producto
// const newProduct = productManager.addProduct({
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25,
// });

// console.log("Producto agregado:", newProduct);

// // Llamar a getProducts nuevamente (debe mostrar el producto recién agregado)
// console.log(productManager.getProducts());

// // Intentar agregar un producto con el mismo código (debe arrojar un error)
// try {
//     productManager.addProduct({
//         title: "producto duplicado",
//         description: "Este es un producto duplicado",
//         price: 150,
//         thumbnail: "Otra imagen",
//         code: "abc123",
//         stock: 30,
//     });
// } catch (error) {
//     console.error("Error al agregar producto duplicado:", error.message);
// }

// // Llamar a getProductById con el id del producto recién agregado
// const retrievedProduct = productManager.getProductById(newProduct.id);
// console.log("Producto encontrado por ID:", retrievedProduct);

// // Resto del código de la clase...

