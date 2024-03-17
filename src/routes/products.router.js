import express from 'express';
import ProductManager from '../dao/db/ProductManager.js';
import { uploader } from '../utils.js';
import { getProductsView } from '../controllers/session.controller.js';
import privateRoutesMiddleware from '../middleware/privateRoutesMiddleware.js';
import checkPermissions from '../middleware/adminAndUser.js';
import productModel from '../dao/models/products.model.js';
import userModel from '../dao/models/user.model.js';
const productManager = new ProductManager();
const productsRouter = express.Router();


productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getApiProducts();

        res.status(200).json(products);
    }
    catch (err) {
        req.logger.error('Error al obtener productos:', err);

        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});


productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;

        const productByID = await productModel.findById(pid);

        if (!productByID) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(productByID);
    } catch (err) {
        req.logger.error('Error al obtener producto por ID:', err);
        return res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});


productsRouter.post('/', uploader.array('files'), checkPermissions('create'), async (req, res) => {
    try {
        const userEmail = req.cookies.userEmail;

        const newProduct = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            code: req.body.code,
            thumbnail: req.files,
            category: req.body.category,
            owner: userEmail

        };
        await productManager.addProduct(newProduct);
        res.status(201).json(newProduct);
    }
    catch (err) {
        req.logger.error('Error al agregar un producto:', err);

        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});


//endpoint funciona para swagger, solo para modificar un producto
productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedProduct = req.body;
        const productByID = await productManager.updateProduct(pid, updatedProduct);
        
        if (!productByID) {
            return res.status(404).json({ message: "Product not found" });
        } else {
            return res.status(200).json(productByID);
        }
    } catch (err) {
        console.error('Error al actualizar un producto:', err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

productsRouter.delete('/:pid', checkPermissions('delete'), async (req, res) => {
    try {
        const pid = req.params.pid;

        const product = await productModel.findById(pid);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const userDataString = req.cookies.user;
        const decodedUserDataString = decodeURIComponent(userDataString);
        const userData = JSON.parse(decodedUserDataString);

        if (product.owner === userData.email || userData.rol === 'admin') {
            const deletedProduct = await productManager.deleteProduct(pid);
            await userModel.updateMany({}, { $pull: { cart: { productId: pid } } });

            return res.status(200).json({ "Deleted product": deletedProduct });
        } else {
            return res.status(403).json({ message: "Access denied. You are not the owner of this product." });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ "Error connecting to server": err.message });
    }
});



export { productsRouter };
