import { AccountConfig, AppConfig, FeatureConfig } from './lumberjack.types'

declare const config: {
  accounts: {
    default: AccountConfig
  }
  app: AppConfig
  automated: {
    takeScreenshots?: boolean
  }
  features: FeatureConfig[]
  params?: {
    [key: string]: string | number
  }
};
export default config;