import CryptoJS from 'crypto-js'

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

export const hashPassword = (password) =>
  CryptoJS.SHA256(password, PASSWORD_HASH_SECRET).toString(CryptoJS.enc.Hex)
