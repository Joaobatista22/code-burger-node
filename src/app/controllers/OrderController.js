import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import Order from '../schemas/Order'

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    })
    try {
      // Valide os dados do usuário com o schema Yup
      await schema.validate(req.body, { abortEarly: false })
    } catch (error) {
      // Se houver erros de validação, retorne uma mensagem de erro detalhada
      return res.status(400).json({ error: error.errors })
    }

    const productsId = req.body.products.map((product) => product.id)
    const orderProducts = await Product.findAll({
      where: { id: productsId },
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    })
    const editedProduct = orderProducts.map((product) => {
      const productIndex = req.body.products.findIndex(
        (p) => p.id === product.id,
      )

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: req.body.products[productIndex].quantity,
      }
      return newProduct
    })
    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: editedProduct,
    }

    return res.status(201).json(editedProduct)
  }
}

export default new OrderController()
