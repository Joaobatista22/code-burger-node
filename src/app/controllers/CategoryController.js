import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required().trim(), // Apenas validando o campo 'name'
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (error) {
      // Retornando erros de validação
      return res.status(400).json({ error: error.errors })
    }
    const { admin: isAdmin } = await User.findByPk(req.userId)
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: 'Only admins can create categories' })
    }

    const { name } = req.body
    const categoryExists = await Category.findOne({ where: { name } })

    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists.' })
    }

    const { id } = await Category.create({ name })

    return res.json(id)
  }

  async index(req, res) {
    const categories = await Category.findAll()
    return res.json(categories)
  }
}

export default new CategoryController()
