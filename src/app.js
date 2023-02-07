import ProductManager from "./ProductManager.js";

import express from "express";

const app = express(); //app es igual a la ejecucion de express
const PORT = 8080;

app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)

const productsFile = new ProductManager("src/Products.txt");

//para saber si esta activo. Monitoreo
app.get("/", (req, res) => {
  res.send("Listening");
});

//recupera todos los productos. puede ser limitado si se informa por URL
app.get("/products", async (req, res) => {
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
app.get("/products/:pid", async (req, res) => {
  let pid = parseInt(req.params.pid);

  const products = await productsFile.getProducts();

  let exist = products.some((product) => product.id === pid); //valida que exista algun producto con ese id 

  if (exist) {
    const indice = products.findIndex((product) => product.id === pid);
    res.send(JSON.stringify(products[indice])); //Devuelve el producto con el id
  } else {
    res.send("<h1>No existe el Id informado</h1>"); //Informa que no existe un producto con el id informado
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is listening!`);
});
