'use client';

import type { Classification, UrgencyLevel } from '@/types';

interface Props {
  classification: Classification;
}

const urgencyConfig: Record<UrgencyLevel, { label: string; bg: string; text: string; border: string; dot: string }> = {
  low:       { label: '일반',          bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
  medium:    { label: '주의',          bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400' },
  high:      { label: '빠른 진료 필요', bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  dot: 'bg-orange-400' },
  emergency: { label: '응급',          bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500' },
};

const HOSPITAL_URL = 'https://www.samsun.or.kr/samsun/contents/view.do?mId=38';

export default function ClassificationCard({ classification }: Props) {
  const urgency = urgencyConfig[classification.urgency_level];

  return (
    <div className={`rounded-xl border ${urgency.border} ${urgency.bg} overflow-hidden`}>
      {/* Emergency banner */}
      {classification.is_emergency && (
        <div className="flex items-center gap-2 bg-red-600 px-3 py-2.5 text-white">
          <span className="text-base">🚨</span>
          <span className="text-xs font-semibold">응급 상황 — 즉시 119에 신고하거나 응급실을 방문하세요!</span>
        </div>
      )}

      <div className="p-3">
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${urgency.bg} ${urgency.text} ${urgency.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
            {urgency.label}
          </span>
          {classification.recommended_department && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#0f2561]/8 text-[#0f2561] border border-[#0f2561]/20">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {classification.recommended_department}
            </span>
          )}
        </div>

        {/* Symptoms */}
        {classification.symptoms.length > 0 && (
          <div className="mb-2">
            <p className="text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">감지된 증상</p>
            <div className="flex flex-wrap gap-1">
              {classification.symptoms.map((s, i) => (
                <span key={i} className="rounded-md bg-white/80 px-2 py-0.5 text-xs text-gray-700 border border-gray-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suspected conditions */}
        {classification.suspected_conditions.length > 0 && (
          <div className="mb-2">
            <p className="text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">의심 질환 (참고용)</p>
            <div className="flex flex-wrap gap-1">
              {classification.suspected_conditions.map((c, i) => (
                <span key={i} className="rounded-md bg-white/80 px-2 py-0.5 text-xs text-gray-600 border border-gray-200">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Guidance */}
        {classification.hospital_guidance && (
          <p className={`text-xs mt-1.5 ${urgency.text} leading-relaxed`}>
            💡 {classification.hospital_guidance}
          </p>
        )}

        {/* Actions */}
        <div className="mt-2.5 flex gap-2">
          <a
            href={HOSPITAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0f2561] text-white hover:bg-[#1a3a7a] transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            의료진 보기
          </a>
          <a
            href={HOSPITAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#0f2561]/20 text-[#0f2561] hover:bg-[#0f2561]/5 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            진료예약
          </a>
        </div>

        <p className="mt-2 text-[10px] text-gray-400">
          * 본 안내는 참고용이며 전문의 진단을 대체하지 않습니다.
        </p>
      </div>
    </div>
  );
}
