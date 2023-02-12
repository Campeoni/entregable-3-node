import {promises as fs} from 'fs';
import PM from "./ProductsManager.js"
const ProductsManager = new PM('src/models/products.txt')

class CartsManager{
  
  //Ejecuta apenas se instancia
  constructor(path) {     
    this.path = path
    this.id = 0
  }

  //Crea el archivo inicializado
  createFile = async() => { 
    try{
      const voidCarts = "[]"
      await fs.writeFile(this.path,voidCarts)     
      return await this.getCarts()
    } catch (error){
      console.log("error del catch: ",error);      
    }    
  } 

  // Consulta el archivo. En caso de no existir datos crea el archivo
  getCarts = async() => {
    try{
      const fileInformation = await fs.readFile(this.path, 'utf-8')  //Pasar de JSON a Objeto
      const carts = JSON.parse(fileInformation)
      //devuelve Carts
      return carts  
      
    } catch (error){        
      //si da error es porque no existe y lo creo
      const answer = await this.createFile()
      return answer        
    }      
  } 
    
  //Busca carrito por ID
  getCartById = async(id) => {
    try{              
      const idParseInt = parseInt(id)
      if (idParseInt) {
        const carts = await this.getCarts();
  
        //si hay carts busca si hay alguno con ese ID
        if (carts.length!==0){
          const cartFilter = carts.filter(element => element.id === idParseInt)

          if (cartFilter.length !== 0) {
            return cartFilter[0]
          } else {
            return "No existe ningun carrito con ese ID";
          }
        } else {
          return "No existe el carrito";
        }
      } else {
        return "Se debe informar un ID";
      }
    }catch (error){
      console.log(error);
    }
  }   

  // Añade un nuevo carrito
  addCart = async() => {    
    try{  
      const carts = await this.getCarts();

      const ordCarts = carts.sort((a, b)=> { //ordena descendentemente
        if (a.id < b.id) {
          return 1;
        }
        if (a.id > b.id) {
          return -1;
        }
        return 0;
      })

      let idAux =  0 // inicializa por si el array esta vacio
      
      if (ordCarts.length !== 0) {
        idAux = ordCarts[0].id //en caso que ya exista 1 caso mueve el > id
      }
      
      const id = CartsManager.autoincrementalID(idAux);

      carts.push({"id":id,"products":[]})   
      await fs.writeFile(this.path, JSON.stringify(carts))
      return true            
  
    }catch (error){
      console.log(error);
    }
  } 

  // Añade nuevo producto a un carrito
  addProductInCart = async(cid,pid) => {    
    try{       
      const cidParseInt = parseInt(cid)
      const pidParseInt = parseInt(pid)

      const existCart = await this.getCartById(cidParseInt);

      if (existCart?.id){   
        const carts = await this.getCarts();
        const indexCart = carts.findIndex(element => element.id === cidParseInt) // Busco el indice del elemento
        
        //recupera el producto con sus cantidades
        const product = await ProductsManager.getProductById(pidParseInt);  
        
        if (product?.id){
          if (product.stock > 0) {
            
            const indexProductCart = carts[indexCart].products.findIndex(element => element.product === pidParseInt) // Busco el indice del elemento
            if (indexProductCart > -1){ //ya existe ese producto en el carrito
              carts[indexCart].products[indexProductCart].quantity++
            } else {
              carts[indexCart].products.push({"product":product.id, "quantity":1})
            }                      

            await fs.writeFile(this.path, JSON.stringify(carts))
            await ProductsManager.updateProduct(pidParseInt,{"stock":(product.stock-1)});  
            return true
          } else {
            return "No hay mas stock de este producto para agregar"
          }
        } else {
          return product;
        }
      } else {
        return existCart;
      }   

    }catch (error){
      console.log(error);
    }
  } 

  // Autoincrementa +1 segun el id informado
  static autoincrementalID(lastId){
    return lastId + 1;
  }
}

export default CartsManager;




