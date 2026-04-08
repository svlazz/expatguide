export type Plan = 'free' | 'pro'

export type ModuleStatus = 'active' | 'completed' | 'archived'

export type AlertType = 'deadline' | 'law-change' | 'inactivity'

export interface DiagnosticQuestion {
  key: string
  question: string
  type: 'date' | 'select' | 'text' | 'boolean'
  options?: string[]
  required: boolean
}

export interface ActionStep {
  key: string
  title: string
  description: string
  officialUrl?: string
  isFree: boolean
}

export interface ModuleConfig {
  id: string
  name: string
  country: string
  questions: DiagnosticQuestion[]
  steps: ActionStep[]
  requiredDocuments: string[]
  deadlines: {
    renewalWindowDays: number
    gracePeriodDays: number
    reminderDays: number[]
  }
}