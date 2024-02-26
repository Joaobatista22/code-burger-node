import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

export default (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: 'Token not provided.' })
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid Token!' })
    }

    req.userId = decoded.id
    req.userName = decoded.name
    return next()
  })
}
