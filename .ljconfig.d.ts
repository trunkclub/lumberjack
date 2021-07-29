import { AppConfig, User } from './utils/_types'

declare const config: {
  accounts: {
    default: User
  }
  app: AppConfig
  features: Array<{
    name: string
    id: string
    paths: string[]
  }>
  params?: {
    [key: string]: string | number
  }
};
export default config;