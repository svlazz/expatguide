import { tieRenewal } from '../modules/tie-renewal'
import { CountryConfig } from '../types'

export const spain: CountryConfig = {
  code: 'es',
  name: 'Spain',
  modules: [tieRenewal],
  authorities: {
    immigration: 'https://sede.administracionespublicas.gob.es',
    tax: 'https://www.agenciatributaria.es',
    socialSecurity: 'https://sede.seg-social.gob.es',
  },
}