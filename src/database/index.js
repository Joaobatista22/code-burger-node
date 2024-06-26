import Sequelize from 'sequelize'
import mongoose from 'mongoose'
import Product from '../app/models/Product'
import User from '../app/models/User'
import Category from '../app/models/Category'


const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize('postgresql://postgres:xUHugCeiUnnGJmvqVdcUOXrewdieUDsA@monorail.proxy.rlwy.net:46685/railway')
    models.forEach((model) => model.init(this.connection))
    models.forEach(
      (model) => model.associate && model.associate(this.connection.models),
    )
  }

  // Connecting MongoDB
  async mongo() {
    try {
      await mongoose.connect('mongodb://mongo:uymGDSgrOJIvPtCmNfAhFxzzUnLjshPS@viaduct.proxy.rlwy.net:18703')
      console.log('Conectado MongoDB!')
    } catch (err) {
      console.error('Erro na conexão com o MongoDB:', err)
    }
  }
}

export default new Database()
