import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (error) {
      return res.status(400).json({ error: error.errors })
    }

    const { filename: path } = req.file
    const { name, price, category_id } = req.body

    try {
      // Verificar se já existe um produto com o mesmo nome
      const existingProduct = await Product.findOne({ where: { name } })
      if (existingProduct) {
        return res
          .status(400)
          .json({ error: 'Já existe um produto com esse nome.' })
      }

      // Criar um novo produto usando os dados fornecidos
      const product = await Product.create({ name, price, category_id, path })
      return res.json(product)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar o produto.' })
    }
  }

  async index(req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      })
      return res.json(products)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar os produtos.' })
    }
  }
}

export default new ProductController()
