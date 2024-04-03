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

    // Verificando se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided.' })
    }

    const { name } = req.body
    const { filename: path } = req.file || {}

    const categoryExists = await Category.findOne({ where: { name } })

    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists.' })
    }

    const category = await Category.create({ name, path })

    return res.json(category)
  }

  async index(req, res) {
    const categories = await Category.findAll()
    return res.json(categories)
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
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
        .json({ error: 'Only admins can update categories' })
    }

    // Verificando se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided.' })
    }

    const { name } = req.body
    const { id } = req.params

    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(400).json({ error: 'Category not found' })
    }

    let newPath = category.path
    if (req.file) {
      newPath = req.file.filename
    }

    await category.update({ name, path: newPath })

    return res.status(200).json(category)
  }
}

export default new CategoryController()