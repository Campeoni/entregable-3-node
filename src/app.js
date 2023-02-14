import express, { application } from "express";
import {__dirname} from "./path.js"
import multer from 'multer'
import routerProducts from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'

//const upload = multer({dest:"src/public/img"})  // Configuracion Basica


// Configurar Multer para almacenar los archivos subidos en el servidor
const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, __dirname + '/public/img')
  },
  filename: (req, file, cb) => {
    console.log("nombre= ", file.originalname);
    cb(null, file.originalname);
  }
} );

// Inicializar Multer con la configuración de almacenamiento
const upload = multer({ storage });

const app = express(); //app es igual a la ejecucion de express
const PORT = 8080;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.post('/upload', upload.single('file'), (req,res) =>{
  console.log("req body: ",req.body);
  console.log("req file: ", req.file);
  
  res.send("imagen cargada")
})
//si una URL no es valida mostramos un mensaje
app.use(function(req, res, next) {
  res.status(404).send('Lo siento, no se pudo encontrar la página que estás buscando.');
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is listening!`);
});


