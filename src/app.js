import express, { application } from "express";
import {__dirname} from "./path.js"
import multer from 'multer'
import routerProduct from './routes/productos.routes.js'

const upload = multer({dest:"src/public/img"})
/* const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, 'src/public/img')
  }
}) */

const app = express(); //app es igual a la ejecucion de express
const PORT = 8080;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use('/upload', upload.single('product'), (req,res) =>{
  console.log(req.file);
  res.send("imagen cargada")
})
//si una URL no es valida mostramos un mensaje
app.use(function(req, res, next) {
  res.status(404).send('Lo siento, no se pudo encontrar la página que estás buscando.');
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is listening!`);
});
