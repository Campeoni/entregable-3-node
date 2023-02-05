import {promises as fs} from 'fs';

class ProductManager{

  //Ejecuta apenas se instancia
  constructor(path) {     
    this.path = path
    this.id = 0
  }

  //Crea el archivo inicializado
  createFile = async() => { 
    try{
      const voidProduct = "[]"
      await fs.writeFile(this.path,voidProduct)     
      return await this.getProducts ()
    } catch (error){
      console.log("error del catch: ",error);      
    }    
  } 

  // Consulta el archivo. En caso de no existir datos crea el archivo
  getProducts = async() => {
      try{
        const fileInformation = await fs.readFile(this.path, 'utf-8')  //Pasar de JSON a Objeto
        const products = JSON.parse(fileInformation)
        //devuelve productos
        return products  
        
      } catch (error){
        //console.log("error del catch: ",error);
        //si da error es porque no existe y lo creo
        const answer = await this.createFile()
        return answer        
      }      
  } 

  // Añade nuevo producto
  addProduct = async(title, description, price, thumnail, code, stock) => {    
    try{
      const newProduct = {title, description, price, thumnail, code, stock} //crea un objeto con los datos de entrada
      
      if (!(this.hasVoid(newProduct))) { //valida si tiene campos vacios
        const products = await this.getProducts();
  
        const ordProduct = products.sort((a, b)=> { //ordena descendentemente
          if (a.id < b.id) {
            return 1;
          }
          if (a.id > b.id) {
            return -1;
          }
          return 0;
        })

        let idAux =  0 // inicializa por si el array esta vacio
        
        if (ordProduct.length !== 0) {
          idAux = ordProduct[0].id //en caso que ya exista 1 caso mueve el > id
        }
        
        const id = ProductManager.autoincrementalID(idAux);

        products.push({id,...newProduct} )   
        await fs.writeFile(this.path, JSON.stringify(products))
        return true
            
      } else {
        return `Hay campos vacios! -> ", ${newProduct}`
      }
    }catch (error){
      console.log(error);
    }
  } 

  //Busca producto por ID
  getProductById = async(id) => {
    try{
            
      if (id) {
        const products = await this.getProducts();
  
        //si hay productos busca si hay alguno con ese ID
        if (products.length!==0){
          const productFilter = products.filter(element => element.id === id)

          if (productFilter.length !== 0) {
            return productFilter[0]
          } else {
            return "No existe ningun producto con ese ID";
          }
        } else {
          return "No hay productos";
        }
      } else {
        return "Se debe informar un ID";
      }
    }catch (error){
      console.log(error);
    }
  }   

  //Actualizao producto por ID
  updateProduct = async(id, title, description, price, thumnail, code, stock) => {

    const productExist = await this.getProductById(id); // Valido que exista el ID

    if (productExist?.id ){
      const products = await this.getProducts();
      
      const index = products.findIndex(element => element.id === id) // Busco el indice del elemento
      
      title && (products[index].title = title)
      description && (products[index].description = description)
      price && (products[index].price = price)
      thumnail && (products[index].thumnail = thumnail)
      code && (products[index].code = code)
      stock && (products[index].stock = stock)
      
      await fs.writeFile(this.path,JSON.stringify(products)) // grabo 
      return true
    } else {
      return productExist // en caso de no existir el id muestro mensaje 
    }    
  }   

  //Elimina producto por ID
  deleteProduct = async(id) => {

    const productExist = await this.getProductById(id); // Valido que exista el ID
    
    if (productExist?.id ){
      const products = await this.getProducts();
      const productFilter = products.filter(element => element.id !== id) // saco el producto con el id
      await fs.writeFile(this.path,JSON.stringify(productFilter)) // grabo 
      return true
    } else {
      return productExist // en caso de no existir el id muestro mensaje 
    }    
  }
    
  //Valida que todos los campos esten completos
  hasVoid(obj) {
    for (const key in obj) {
      if (!obj[key]) {
        return true;
      }
    }
    return false;
  };

  // Autoincrementa +1 segun el id informado
  static autoincrementalID(lastId){
    return lastId + 1;
  }
}

export default ProductManager;


/* 

//Crea nueva instancia de ProductManager
const administrador = new ProductManager("./products.txt");


const crear = async (title, description, price, thumnail, code, stock) => {
  console.log("crear: ", await administrador.addProduct(title, description, price, thumnail, code, stock));  
}

const consulta = async () => {
  console.log("consulta: ", await administrador.getProducts());
}  

const buscarId = async (id) => {
  console.log("buscar por ID: ", await administrador.getProductById(id));
}  

const eliminaId = async (id) => {
  console.log("elimina por ID: ", await administrador.deleteProduct(id));
}  

const updateId = async (id, title, description, price, thumnail, code, stock) => {
  console.log("Acctualizado por ID: ", await administrador.updateProduct(id, title, description, price, thumnail, code, stock));
}  

const prueba = async () => {
  await consulta();
  await crear("producto prueba  1", "Este es un producto prueba  1",  100, "Sin imagen   1", "abc001",   10 );
  await crear("producto prueba  2", "Este es un producto prueba  2",  200, "Sin imagen   2", "abc002",   20 );
  await crear("producto prueba  3", "Este es un producto prueba  3",  300, "Sin imagen   3", "abc003",   30 );
  await crear("producto prueba  4", "Este es un producto prueba  4",  400, "Sin imagen   4", "abc004",   40 );
  await crear("producto prueba  5", "Este es un producto prueba  5",  500, "Sin imagen   5", "abc005",   50 );
  await crear("producto prueba  6", "Este es un producto prueba  6",  600, "Sin imagen   6", "abc006",   60 );
  await crear("producto prueba  7", "Este es un producto prueba  7",  700, "Sin imagen   7", "abc007",   70 );
  await crear("producto prueba  8", "Este es un producto prueba  8",  800, "Sin imagen   8", "abc008",   80 );
  await crear("producto prueba  9", "Este es un producto prueba  9",  900, "Sin imagen   9", "abc009",   90 );
  await crear("producto prueba 10", "Este es un producto prueba 10", 1000, "Sin imagen  10", "abc010",  100 );
  await crear("producto prueba 11", "Este es un producto prueba 11", 1100, "Sin imagen  11", "abc011",  110 );
  await crear("producto prueba 12", "Este es un producto prueba 12", 1200, "Sin imagen  12", "abc012",  120 );
  await crear("producto prueba 13", "Este es un producto prueba 13", 1300, "Sin imagen  13", "abc013",  130 );
  await crear("producto prueba 14", "Este es un producto prueba 14", 1400, "Sin imagen  14", "abc014",  140 );
  await crear("producto prueba 15", "Este es un producto prueba 15", 1500, "Sin imagen  15", "abc015",  150 );
  await crear("producto prueba 16", "Este es un producto prueba 16", 1600, "Sin imagen  16", "abc016",  160 );
  await crear("producto prueba 17", "Este es un producto prueba 17", 1700, "Sin imagen  17", "abc017",  170 );
  await crear("producto prueba 18", "Este es un producto prueba 18", 1800, "Sin imagen  18", "abc018",  180 );
  await crear("producto prueba 19", "Este es un producto prueba 19", 1900, "Sin imagen  19", "abc019",  190 );
  await crear("producto prueba 20", "Este es un producto prueba 20", 2000, "Sin imagen  20", "abc020",  200 );
  await consulta();
  await buscarId(1);
  await buscarId(2);
  await updateId(1,"producto actualizado","", "","","");
  await buscarId(1);
  await eliminaId(1);
  await buscarId(1); 
}

prueba();

*/



