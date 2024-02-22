import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import ProductController from './app/controllers/ProductController'
import CategoryController from './app/controllers/CategoryController'
import authMiddleware from './app/middlewares/auth'

const upload = multer(multerConfig)

const routes = new Router()
routes.post('/users', UserController.store) //Rota Criar um usuário
routes.post('/sessions', SessionController.store) //Rota Fazer login no sistema
routes.use(authMiddleware) // Middleware de autenticação aplicado a todas as rotas abaixo
// Rotas de produtos
routes.post('/products', upload.single('file'), ProductController.store) // Rota para criar um produto
routes.get('/products', ProductController.index) // Rota para listar todos os produtos
// Rotas de categorias
routes.post('/categories', CategoryController.store) // Rota para criar uma categoria
routes.get('/categories', CategoryController.index) // Rota para listar todas as categorias
module.exports = routes
