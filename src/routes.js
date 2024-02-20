import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import ProductController from './app/controllers/ProductController'

const upload = multer(multerConfig)

const routes = new Router()
routes.post('/users', UserController.store) //Rota Criar um usuário
routes.post('/sessions', SessionController.store) //Rota Fazer login no sistema
routes.post('/products', upload.single('file'), ProductController.store) //Rota criar um produto, o middleware de

export default routes
