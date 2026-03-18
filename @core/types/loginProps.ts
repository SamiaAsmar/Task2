export type LoginPageProps = {
  login: (email: string, password: string, role: string) => Promise<void>
  loading: boolean
}
