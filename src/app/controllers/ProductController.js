import * as Yup from 'yup'
import Product from '../models/Product'

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category: Yup.string().required(),
    })

    try {
      await schema.validate(req.body)
      req.body.id = require('nanoid').generate()

      // Se req.file existir, adiciona o path ao objeto do produto
      const { filename: path } = req.file
      const { name, price, category } = req.body

      // Criando o produto e esperando pela resolução da Promise
      const product = await Product.create({ name, price, category, path })

      // Respondendo com o produto criado
      return res.json(product)
    } catch (error) {
      // Retornando erros de validação
      return res.status(400).json({ error: error.errors })
    }
  }
}

export default new ProductController()
