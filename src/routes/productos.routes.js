import { Router } from "express";
import  ProductManager from "../controllers/ProductManager.js";

const routerProduct = Router()
const productsFile = new ProductManager('src/models/products.txt')

//recupera todos los productos. puede ser limitado si se informa por URL
routerProduct.get("/", async (req, res) => {
  let { limit } = req.query;
  const products = await productsFile.getProducts();
  
  if (limit) { // Valida que se haya informado el limite
    const productLimit = products.slice(0, limit);
    res.send(JSON.stringify(productLimit)); //Muestra los productos Limitados
  } else {
    res.send(JSON.stringify(products)); // Muestro todos los productos
  }
});
  
//recupera el producto por el id indicado en la URL
routerProduct.get("/:pid", async (req, res) => {
  const products = await productsFile.getProductById(req.params.pid);  
  res.send(JSON.stringify(products)); //Devuelve el producto con el id
  
});

//Elimina el producto especificado
routerProduct.delete("/:pid", async (req, res) => {
  let answer = await productsFile.deleteProduct(req.params.pid);
  res.send(answer === true ? "Producto eliminado" : answer);   
});

//Inserta un nuevo producto
routerProduct.post("/", async (req, res) => {  
  let answer = await productsFile.addProduct(req.body);
  res.send(answer === true ? "Producto agregado" : answer); 
});

//Elimina el producto especificado
routerProduct.put("/:pid", async (req, res) => {
  let answer = await productsFile.updateProduct(req.params.pid,req.body);
  res.send(answer === true ? "Producto actualizado" : answer);   
});

export default routerProduct