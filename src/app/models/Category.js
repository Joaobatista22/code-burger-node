import Sequelize, { Model } from 'sequelize'

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'category', // Nome do modelo na base de dados (opcional)
      },
    )
  }
}

export default Category
