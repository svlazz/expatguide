import { ModuleConfig } from '../types'

export const tieRenewal: ModuleConfig = {
  id: 'tie-renewal',
  name: 'TIE Renewal',
  country: 'spain',

  questions: [
    {
      key: 'tie_expiry_date',
      question: 'What is the expiry date on your current TIE card?',
      type: 'date',
      required: true,
    },
    {
      key: 'tie_type',
      question: 'What type of TIE do you currently hold?',
      type: 'select',
      options: [
        'EU Family Member',
        'Non-Lucrative Residence',
        'Work Permit',
        'Digital Nomad',
        'Student',
        'Other',
      ],
      required: true,
    },
    {
      key: 'province',
      question: 'In which Spanish province do you live?',
      type: 'select',
      options: [
        'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga',
        'Alicante', 'Murcia', 'Palma', 'Las Palmas', 'Other',
      ],
      required: true,
    },
    {
      key: 'has_empadronamiento',
      question: 'Do you have a current Empadronamiento (certificate of registration)?',
      type: 'boolean',
      required: true,
    },
    {
      key: 'has_private_health_insurance',
      question: 'Do you have private health insurance valid in Spain?',
      type: 'boolean',
      required: true,
    },
    {
      key: 'has_proof_of_income',
      question: 'Can you prove sufficient income or savings? (bank statements, pension, salary)',
      type: 'boolean',
      required: true,
    },
    {
      key: 'has_nie',
      question: 'Do you have your NIE number?',
      type: 'boolean',
      required: true,
    },
    {
      key: 'previous_renewal',
      question: 'Have you renewed your TIE before?',
      type: 'boolean',
      required: true,
    },
  ],

  steps: [
    {
      key: 'check_expiry',
      title: 'Check your TIE expiry date',
      description: 'Locate your current TIE card and confirm the exact expiry date. You can start the renewal process up to 60 days before it expires.',
      isFree: true,
    },
    {
      key: 'gather_documents',
      title: 'Gather your documents',
      description: 'Collect all required documents: current TIE, passport, empadronamiento, proof of income, and health insurance certificate.',
      isFree: true,
    },
    {
      key: 'fill_ex17',
      title: 'Complete form EX-17',
      description: 'Download and fill in form EX-17 (Solicitud de renovación de la autorización de residencia). This is the official renewal application form.',
      officialUrl: 'https://www.interior.gob.es/opencms/pdf/servicios-al-ciudadano/extranjeria/formularios-extranjeria/EX-17.pdf',
      isFree: true,
    },
    {
      key: 'pay_fee',
      title: 'Pay the renewal fee (Tasa 790-052)',
      description: 'Pay the government fee online using Modelo 790 Código 052. The current fee is approximately 16€. Keep the payment receipt — you need it at your appointment.',
      officialUrl: 'https://sede.administracionespublicas.gob.es',
      isFree: true,
    },
    {
      key: 'book_appointment',
      title: 'Book your appointment at Extranjería',
      description: 'Book your cita previa at your local Oficina de Extranjería. Appointments fill up extremely fast — check every day at 8:00am and 2:00pm when new slots are released.',
      officialUrl: 'https://sede.administracionespublicas.gob.es/icpplus/',
      isFree: false,
    },
    {
      key: 'attend_appointment',
      title: 'Attend your Extranjería appointment',
      description: 'Bring all original documents plus one photocopy of each. Arrive 15 minutes early. You will receive a resguardo (receipt) confirming your renewal is in process — this document keeps you legal while you wait.',
      isFree: false,
    },
    {
      key: 'collect_tie',
      title: 'Collect your new TIE card',
      description: 'Once notified, return to the Extranjería office to collect your new TIE card. Processing typically takes 1-3 months. Track your application status online.',
      officialUrl: 'https://sede.administracionespublicas.gob.es',
      isFree: false,
    },
  ],

  requiredDocuments: [
    'Current TIE card (original + photocopy)',
    'Valid passport (original + photocopy)',
    'Empadronamiento certificate (less than 3 months old)',
    'Proof of income or savings (last 3 months bank statements)',
    'Private health insurance certificate (if applicable)',
    'Completed form EX-17',
    'Tasa 790-052 payment receipt',
    '1 recent passport photo',
  ],

  deadlines: {
    renewalWindowDays: 60,
    gracePeriodDays: 90,
    reminderDays: [90, 60, 30, 7],
  },
}