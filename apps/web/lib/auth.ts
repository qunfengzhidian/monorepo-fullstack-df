export const DEFAULT_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
}

export const AUTH_COOKIE = 'app-auth'

export function validateCredentials(email: string, password: string): boolean {
  return (
    email === DEFAULT_CREDENTIALS.email &&
    password === DEFAULT_CREDENTIALS.password
  )
}
