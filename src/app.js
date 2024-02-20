import express from 'express'
import routes from './routes'
import './database'
class App {
  constructor() {
    this.app = express()
    this.Middleware()
    this.Routes()
  }

  Middleware() {
    this.app.use(express.json()) // parse request of content type application/json
  }

  Routes() {
    this.app.use(routes)
  }
}
export default new App().app
