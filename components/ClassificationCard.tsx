'use client';

import type { Classification, UrgencyLevel } from '@/types';

interface Props {
  classification: Classification;
}

const urgencyConfig: Record<UrgencyLevel, { label: string; bg: string; text: string; border: string; dot: string }> = {
  low:       { label: '일반',           bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', dot: '#22c55e' },
  medium:    { label: '주의',           bg: '#fffbeb', text: '#d97706', border: '#fde68a', dot: '#f59e0b' },
  high:      { label: '빠른 진료 필요', bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', dot: '#f97316' },
  emergency: { label: '응급',           bg: '#fff1f2', text: '#dc2626', border: '#fecaca', dot: '#ef4444' },
};

const HOSPITAL_URL = 'https://www.samsun.or.kr/samsun/contents/view.do?mId=38';

export default function ClassificationCard({ classification }: Props) {
  const u = urgencyConfig[classification.urgency_level];

  return (
    <div style={{ borderRadius: '12px', border: `1px solid ${u.border}`, background: u.bg, overflow: 'hidden' }}>
      {classification.is_emergency && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dc2626', padding: '10px 14px', color: '#ffffff' }}>
          <span style={{ fontSize: '16px' }}>🚨</span>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>응급 상황 — 즉시 119에 신고하거나 응급실을 방문하세요!</span>
        </div>
      )}

      <div style={{ padding: '12px 14px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            background: u.bg, color: u.text, border: `1px solid ${u.border}`
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: u.dot, display: 'inline-block' }} />
            {u.label}
          </span>
          {classification.recommended_department && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
              background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe'
            }}>
              🏥 {classification.recommended_department}
            </span>
          )}
        </div>

        {/* Symptoms */}
        {classification.symptoms.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '5px', letterSpacing: '0.05em' }}>감지된 증상</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {classification.symptoms.map((s, i) => (
                <span key={i} style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '12px', color: '#374151', background: 'rgba(255,255,255,0.8)', border: '1px solid #e5e7eb' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suspected conditions */}
        {classification.suspected_conditions.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '5px', letterSpacing: '0.05em' }}>의심 질환 (참고용)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {classification.suspected_conditions.map((c, i) => (
                <span key={i} style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '12px', color: '#6b7280', background: 'rgba(255,255,255,0.8)', border: '1px solid #e5e7eb' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Guidance */}
        {classification.hospital_guidance && (
          <p style={{ fontSize: '12px', color: u.text, lineHeight: '1.5', marginBottom: '10px' }}>
            💡 {classification.hospital_guidance}
          </p>
        )}

        {/* Single CTA button */}
        <a
          href={HOSPITAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
            color: '#ffffff', fontSize: '13px', fontWeight: 600,
            textDecoration: 'none', boxShadow: '0 2px 8px rgba(30,58,95,0.3)'
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          진료 예약 / 의료진 보기
        </a>

        <p style={{ marginTop: '8px', fontSize: '10px', color: '#9ca3af' }}>
          * 본 안내는 참고용이며 전문의 진단을 대체하지 않습니다.
        </p>
      </div>
    </div>
  );
}
