export interface UserData {
  id: number
  username: string
  email: string
  password: string
  role: 'user' | 'admin'
  active: boolean
}

export type User = Omit<UserData, 'password'>
