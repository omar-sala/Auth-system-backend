export type RegisterData = {
  name: string
  email: string
  password: string
}

export type LoginData = {
  email: string
  password: string
}

export type User = {
  id: number
  name: string
  email: string
  googleId?: string | null
}
