import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import { MEDICAL_SYSTEM_PROMPT } from '@/lib/prompts';
import type { ChatRequest, ChatResponse, Classification } from '@/types';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://medical-consultation-bot.vercel.app',
    'X-Title': '병원 AI 상담봇 - 메디봇',
  },
});

const FALLBACK_CLASSIFICATION: Classification = {
  intent: 'general',
  symptoms: [],
  suspected_conditions: [],
  recommended_department: '일반 진료',
  is_emergency: false,
  urgency_level: 'low',
  hospital_guidance: '가까운 병원에 방문하시거나 담당 의사와 상담해 주세요.',
};

function parseAIResponse(content: string): ChatResponse {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found');

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    message: parsed.message || '죄송합니다. 응답을 처리하는 중 오류가 발생했습니다.',
    classification: {
      intent: parsed.classification?.intent ?? 'general',
      symptoms: parsed.classification?.symptoms ?? [],
      suspected_conditions: parsed.classification?.suspected_conditions ?? [],
      recommended_department: parsed.classification?.recommended_department ?? '일반 진료',
      is_emergency: parsed.classification?.is_emergency ?? false,
      urgency_level: parsed.classification?.urgency_level ?? 'low',
      hospital_guidance: parsed.classification?.hospital_guidance ?? '',
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const { message, session_id, history }: ChatRequest = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: '메시지를 입력해 주세요.' }, { status: 400 });
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
      ...history.slice(-8).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages,
      temperature: 0.3,
      max_tokens: 1024,
    });

    const rawContent = completion.choices[0]?.message?.content ?? '';

    let response: ChatResponse;
    try {
      response = parseAIResponse(rawContent);
    } catch {
      response = {
        message: rawContent || '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
        classification: FALLBACK_CLASSIFICATION,
      };
    }

    supabaseAdmin
      .from('consultations')
      .insert({
        session_id,
        patient_message: message,
        ai_response: response.message,
        classification: response.classification,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase insert error:', error);
      });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
}
