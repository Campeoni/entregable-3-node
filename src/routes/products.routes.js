import { Router } from "express";
import  ProductsManager from "../controllers/ProductsManager.js";

const routerProducts = Router()
const productsFile = new ProductsManager('src/models/products.txt')

//Recupera todos los productos. puede ser limitado si se informa por URL
routerProducts.get("/", async (req, res) => {
  let { limit } = req.query;
  const products = await productsFile.getProducts();
  
  if (limit) { // Valida que se haya informado el limite
    const productLimit = products.slice(0, limit);
    res.send(JSON.stringify(productLimit)); //Muestra los productos Limitados
  } else {
    res.send(JSON.stringify(products)); // Muestro todos los productos
  }
});
  
//Recupera el producto por el id indicado en la URL
routerProducts.get("/:pid", async (req, res) => {
  const products = await productsFile.getProductById(req.params.pid);  
  res.send(JSON.stringify(products)); //Devuelve el producto con el id
  
});

//Inserta un nuevo producto
routerProducts.post("/", async (req, res) => {  
  let answer = await productsFile.addProduct(req.body);
  res.send(answer === true ? "Producto agregado" : answer); 
});

//Actualiza el producto especificado
routerProducts.put("/:pid", async (req, res) => {
  let answer = await productsFile.updateProduct(req.params.pid,req.body);
  res.send(answer === true ? "Producto actualizado" : answer);   
});

//Elimina el producto especificado
routerProducts.delete("/:pid", async (req, res) => {
  let answer = await productsFile.deleteProduct(req.params.pid);
  res.send(answer === true ? "Producto eliminado" : answer);   
});

export default routerProducts