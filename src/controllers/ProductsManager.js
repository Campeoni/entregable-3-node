import {promises as fs} from 'fs';

class ProductsManager{  
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
      //si da error es porque no existe y lo creo
      const answer = await this.createFile()
      return answer        
    }      
  } 
    
  //Busca producto por ID
  getProductById = async(id) => {
    try{              
      const idParseInt = parseInt(id)
      if (id) {
        const products = await this.getProducts();
  
        //si hay productos busca si hay alguno con ese ID
        if (products.length!==0){
          const productFilter = products.filter(element => element.id === idParseInt)

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

  //Elimina producto por ID
  deleteProduct = async(id) => {
    try{
      const idParseInt = parseInt(id)
      const productExist = await this.getProductById(idParseInt); // Valido que exista el ID
      
      if (productExist?.id ){
        const products = await this.getProducts();
        const productFilter = products.filter(element => element.id !== idParseInt) // saco el producto con el id
        await fs.writeFile(this.path,JSON.stringify(productFilter)) // grabo 
        return true
      } else {
        return productExist // en caso de no existir el id muestro mensaje 
      }     
    }catch (error){
      console.log(error);
    }   
  }  
    
  // Añade nuevo producto
  addProduct = async(product) => {    
    try{      
      const voids = this.hasVoid(product);

      if (( voids.resultCode === false)) { //valida si tiene campos vacios
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
        
        const id = ProductsManager.autoincrementalID(idAux);

        products.push({id,...product, "status":true} )   
        await fs.writeFile(this.path, JSON.stringify(products))
        return true
            
      } else {
        return `Hay campos vacios! -> ", ${JSON.stringify(voids.voidField)}`
      }
    }catch (error){
      console.log(error);
    }
  } 

  //Actualizao producto por ID
  updateProduct = async(id, product) => {
    try{     
      const idParseInt = parseInt(id)
      const productExist = await this.getProductById(idParseInt); // Valido que exista el ID

      if (productExist?.id ){
        const products = await this.getProducts();
        
        const index = products.findIndex(element => element.id === idParseInt) // Busco el indice del elemento

        // Los campos que vienen informados se actualizaran
        product.title       === undefined || (products[index].title       = product.title)
        product.description === undefined || (products[index].description = product.description)
        product.price       === undefined || (products[index].price       = product.price)
        product.thumnail    === undefined || (products[index].thumnail    = product.thumnail)
        product.code        === undefined || (products[index].code        = product.code)
        product.category    === undefined || (products[index].category     = product.category)      
        product.stock       === undefined || (products[index].stock       = product.stock)
        product.status      === undefined || (products[index].status      = product.status)
        
        await fs.writeFile(this.path,JSON.stringify(products)) // grabo 
        return true
      } else {
        return productExist // en caso de no existir el id muestro mensaje 
      } 
    }catch(error) {
      console.log(error);
    }
  }   

    
  //Valida que todos los campos qeu son obligatorios
  hasVoid(obj) {
      
    const fields = [{"key":"title","mandatory":true}, 
                    {"key":"description","mandatory":true},
                    {"key":"code","mandatory":true},
                    {"key":"price","mandatory":true},
                    {"key":"status","mandatory":false},
                    {"key":"stock","mandatory":true},
                    {"key":"category","mandatory":true},
                    {"key":"thumnail","mandatory":false}]
    //valido cada campo aceptado. Si es obligatorio y no vino informado doy error
    let result = {"resultCode":false,"voidField":[]}
    fields.forEach( (field=>{
      if (field.mandatory){                
        if(obj[field.key]===undefined){ //En caso de no estar informado de concatena y devuelve en una cadena          
          result.resultCode = true;
          result.voidField.push(field.key);
        }
      }      
    }))         

    return result;    
  };

  // Autoincrementa +1 segun el id informado
  static autoincrementalID(lastId){
    return lastId + 1;
  }}

export default ProductsManager;