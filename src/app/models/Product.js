import Sequelize, { Model } from 'sequelize'

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `https://code-burger-node-production.up.railway.app/product-file/${this.path}`
          },
        },
      },
      {
        sequelize,
        modelName: 'Product', // Nome do modelo na base de dados
      },
    )
    return this
  }

  static associate(models) {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    })
  }
}

export default Product