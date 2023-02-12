import { Router } from "express";
import  CartsManager from "../controllers/CartsManager.js";

const routerCarts = Router()
const cartsFile = new CartsManager('src/models/carts.txt')

//recupera el carrito especificado
routerCarts.get("/:cid", async (req, res) => {
  const cart = await cartsFile.getCartById(req.params.cid);  
  res.send(JSON.stringify(cart)); //Devuelve el carrito con el id
  
});

//Inserta un nuevo carrito
routerCarts.post("/", async (req, res) => {  
  let answer = await cartsFile.addCart();
  res.send(answer === true ? "carrito agregado" : answer); 
});

//Inserta nuevos producto al carrito especificado
routerCarts.post("/:cid/products/:pid", async (req, res) => {  
  let answer = await cartsFile.addProductInCart(req.params.cid,req.params.pid);
  res.send(answer === true ? "Producto agregado al carrito" : answer); 
});

export default routerCarts