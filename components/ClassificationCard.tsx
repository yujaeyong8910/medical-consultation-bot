'use client';

import type { Classification, UrgencyLevel } from '@/types';

interface Props {
  classification: Classification;
}

const urgencyConfig: Record<UrgencyLevel, { label: string; bg: string; text: string; border: string }> = {
  low: { label: '일반', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  medium: { label: '주의', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  high: { label: '빠른 진료 필요', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  emergency: { label: '응급', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function ClassificationCard({ classification }: Props) {
  const urgency = urgencyConfig[classification.urgency_level];

  return (
    <div className={`mt-2 rounded-xl border p-3 text-sm ${urgency.bg} ${urgency.border}`}>
      {classification.is_emergency && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white font-semibold text-xs">
          <span>🚨</span>
          <span>응급 상황 — 즉시 119에 신고하거나 응급실을 방문하세요!</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${urgency.bg} ${urgency.text} border ${urgency.border}`}>
          긴급도: {urgency.label}
        </span>
        {classification.recommended_department && (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            🏥 {classification.recommended_department}
          </span>
        )}
      </div>

      {classification.symptoms.length > 0 && (
        <div className="mb-1.5">
          <p className="text-xs font-semibold text-gray-500 mb-1">감지된 증상</p>
          <div className="flex flex-wrap gap-1">
            {classification.symptoms.map((s, i) => (
              <span key={i} className="rounded-md bg-white px-2 py-0.5 text-xs text-gray-700 border border-gray-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {classification.suspected_conditions.length > 0 && (
        <div className="mb-1.5">
          <p className="text-xs font-semibold text-gray-500 mb-1">의심 질환 (참고용)</p>
          <div className="flex flex-wrap gap-1">
            {classification.suspected_conditions.map((c, i) => (
              <span key={i} className="rounded-md bg-white px-2 py-0.5 text-xs text-gray-600 border border-gray-200">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {classification.hospital_guidance && (
        <p className={`text-xs mt-1 ${urgency.text}`}>
          💡 {classification.hospital_guidance}
        </p>
      )}

      <p className="mt-2 text-xs text-gray-400">
        * 본 안내는 참고용이며 전문의 진단을 대체하지 않습니다.
      </p>
    </div>
  );
}
