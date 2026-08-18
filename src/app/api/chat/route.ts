import { NextResponse } from 'next/server'

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  text: string
}

const SYSTEM_PROMPT = `Sei "Tutor AI Hexa", un assistente didattico per studenti universitari e delle superiori.
Rispondi sempre in italiano, in modo chiaro, conciso e incoraggiante.
Aiuta con spiegazioni di argomenti, riassunti di appunti, pianificazione dello studio e tecniche di apprendimento.
Se non conosci un dettaglio specifico, dillo onestamente e suggerisci come approfondire.`

function mockReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const text = lastUser?.text.toLowerCase() ?? ''

  if (text.includes('spieg') || text.includes('argomento')) {
    return 'Certo! Dimmi quale argomento vuoi approfondire e a che livello (base o avanzato). Posso spiegartelo con esempi pratici e un mini quiz finale.'
  }
  if (text.includes('riassum') || text.includes('appunt')) {
    return 'Incolla o descrivi i tuoi appunti e ti preparo un riassunto strutturato con i concetti chiave, le definizioni importanti e i punti da ripassare.'
  }
  if (text.includes('pianifica') || text.includes('studio')) {
    return 'Per pianificare al meglio, dimmi: quanti giorni hai, quali materie devi studiare e quante ore al giorno puoi dedicare. Creerò un piano realistico con pause incluse.'
  }

  return `Ho ricevuto il tuo messaggio: "${lastUser?.text}". Sono pronto ad aiutarti con spiegazioni, riassunti o pianificazione dello studio. Cosa preferisci fare?`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : []

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Nessun messaggio fornito' }, { status: 400 })
    }

    const openaiKey = process.env.OPENAI_API_KEY?.trim()
    const openaiModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

    // Modalità demo: risposte mock quando la chiave API non è configurata
    if (!openaiKey) {
      return NextResponse.json({
        reply: mockReply(messages),
        mode: 'mock',
      })
    }

    const openaiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: (m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : 'system') as
          | 'user'
          | 'assistant'
          | 'system',
        content: m.text,
      })),
    ]

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: openaiModel,
        messages: openaiMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!resp.ok) {
      const details = await resp.text()

      if (
        details.includes('insufficient_quota') ||
        details.includes('billing') ||
        details.includes('invalid_api_key') ||
        details.includes('Incorrect API key')
      ) {
        return NextResponse.json({
          reply: mockReply(messages),
          mode: 'mock',
          warning:
            'Credito OpenAI esaurito o chiave non valida. Stai usando la modalità demo.',
        })
      }

      return NextResponse.json(
        { error: 'Errore API OpenAI', details },
        { status: 502 },
      )
    }

    const data = await resp.json()
    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.output?.[0]?.content ??
      'Nessuna risposta dal modello'

    return NextResponse.json({ reply, mode: 'openai' })
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }
}
