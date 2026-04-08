import { spain } from './spain'
import { CountryConfig } from '../types'

export const countries: Record<string, CountryConfig> = {
  spain,
}

export function getCountryConfig(country: string): CountryConfig {
  const config = countries[country]
  if (!config) throw new Error(`Country not found: ${country}`)
  return config
}

export function getModuleConfig(country: string, moduleId: string) {
  const countryConfig = getCountryConfig(country)
  const module = countryConfig.modules.find(m => m.id === moduleId)
  if (!module) throw new Error(`Module not found: ${moduleId} in ${country}`)
  return module
}