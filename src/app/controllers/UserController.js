import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'

class UserController {
  async store(req, res) {
    const { name, email, password, admin } = req.body // Extraia os dados corretamente do corpo da requisição

    // Crie um schema Yup para validar os dados do usuário
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6).max(28),
      admin: Yup.boolean(),
    })

    try {
      // Valide os dados do usuário com o schema Yup
      await schema.validate(req.body, { abortEarly: false })

      // Verifique se o email já existe no banco de dados
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' })
      }

      // Crie uma instância do modelo User
      const user = new User({
        id: uuidv4(), // Utilize uuidv4() para gerar um ID único
        name,
        email,
        password,
        admin,
      })

      // Salve o usuário no banco de dados
      await user.save()

      // Retorne os dados do usuário criado como resposta
      return res.json(user)
    } catch (error) {
      // Se houver erros de validação, retorne uma mensagem de erro detalhada
      return res.status(400).json({ error: error.errors })
    }
  }
}

export default new UserController()
