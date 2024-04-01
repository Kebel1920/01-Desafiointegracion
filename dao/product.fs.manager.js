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



