import { APP_CONFIG } from '../config'
import { getMockResponse } from '../data/chatResponses'
import type { SourceType } from '../store/chatStore'

interface AiResponse {
  content: string
  source?: SourceType
}

/**
 * Parse source badge from AI response.
 * The AI is instructed to append [التصنيف: فرض] etc.
 */
function parseSourceFromResponse(text: string): { content: string; source?: SourceType } {
  const sourceMap: Record<string, SourceType> = {
    'فرض': 'fard',
    'سنة': 'sunnah',
    'عادة ثقافية': 'cultural',
    'مسألة خلافية': 'khilaf',
  }

  const match = text.match(/\[التصنيف:\s*(فرض|سنة|عادة ثقافية|مسألة خلافية)\]/)
  if (match) {
    const cleaned = text.replace(match[0], '').trim()
    return { content: cleaned, source: sourceMap[match[1]] }
  }

  return { content: text }
}

/**
 * Send a question to Anthropic API via proxy endpoint.
 * Falls back to mock responses if API is unavailable.
 */
export async function askAI(
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  apiKey?: string
): Promise<AiResponse> {
  // If no API key configured, use enhanced mock
  if (!apiKey) {
    return getMockResponse(question)
  }

  try {
    const messages = [
      ...history.slice(-6).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: question },
    ]

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: APP_CONFIG.aiSystemPrompt,
        messages,
      }),
    })

    if (!res.ok) {
      console.warn('[Maheel] AI API error, falling back to mock:', res.status)
      return getMockResponse(question)
    }

    const data = await res.json()
    const text = data.content?.[0]?.text ?? ''

    if (!text) return getMockResponse(question)

    return parseSourceFromResponse(text)
  } catch (err) {
    console.warn('[Maheel] AI request failed, falling back to mock:', err)
    return getMockResponse(question)
  }
}
