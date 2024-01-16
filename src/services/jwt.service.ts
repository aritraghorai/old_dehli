import env from '@/utils/env'
import jwt from 'jsonwebtoken'

export type JwtPayload = {
  userId: string
}

const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRED
  })
}
const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded as JwtPayload)
    })
  })
}

export default {
  generateToken,
  verifyToken
}
