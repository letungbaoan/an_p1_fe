export interface UserData {
  id: number
  username: string
  email: string
  password: string
  role: 'user' | 'admin'
}

export type User = Omit<UserData, 'password'>
