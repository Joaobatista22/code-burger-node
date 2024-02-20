import * as Yup from 'yup'
import Jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('Insira um e-mail válido')
        .required('O e-mail é obrigatório'),
      password: Yup.string()
        .min(6, 'No mínimo 6 dígitos')
        .required('A senha é obrigatória'),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' })
    }

    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' })
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha ou email incorreto' })
    }
    return res.json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: Jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn, // Tempo de duração do Token em dias
      }),
    })
  }
}
export default new SessionController()
