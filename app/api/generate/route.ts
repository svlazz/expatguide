import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { getModuleConfig } from '@/config/countries/index'
import { NextRequest, NextResponse } from 'next/server'



const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar que el usuario está autenticado
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Leer los datos de la petición
    const { question, country, moduleId, situation } = await request.json()

    if (!question || !country || !moduleId) {
      return NextResponse.json(
        { error: 'Missing required fields: question, country, moduleId' },
        { status: 400 }
      )
    }

    // 3. Obtener la configuración del módulo para dar contexto a Claude
    const moduleConfig = getModuleConfig(country, moduleId)
    const { getCountryConfig } = await import('@/config/countries/index')
    const countryConfig = getCountryConfig(country)
    const immigrationUrl = countryConfig.authorities.immigration

    // 4. Llamar a Claude con temperatura 0 y contexto del módulo
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0,
      system: `You are a legal assistant helping anglophone expats in Spain with their bureaucratic processes.
You are currently helping with: ${moduleConfig.name}.

Required documents for this process:
${moduleConfig.requiredDocuments.map(doc => `- ${doc}`).join('\n')}

Key deadlines:
- Renewal window: ${moduleConfig.deadlines.renewalWindowDays} days before expiry
- Grace period: ${moduleConfig.deadlines.gracePeriodDays} days after expiry

IMPORTANT RULES:
- Only answer questions related to ${moduleConfig.name} in Spain
- Never invent deadlines, fees, or legal requirements
- If you are not certain about something, say: "I don't have verified information about this. Please check: ${immigrationUrl}"
- Always recommend consulting an official source or gestor for complex legal situations
- Be clear, direct and reassuring — the user is stressed about losing their residency`,

      messages: [
        {
          role: 'user',
          content: `User situation: ${JSON.stringify(situation)}
          
Question: ${question}`,
        },
      ],
    })

    // 5. Extraer el texto de la respuesta y devolverlo
    const answer = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    return NextResponse.json({ answer })

  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}