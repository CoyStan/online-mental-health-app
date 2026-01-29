import 'next-auth'

declare module 'next-auth' {
  interface User {
    role: string
    surveyCompleted: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      surveyCompleted: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    id: string
    surveyCompleted: boolean
  }
}
