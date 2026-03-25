'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';

interface MonthlyData {
  month: string;
  avg: number;
  best: number;
  count: number;
}

interface WeatherData {
  weather: string;
  avg: number;
  count: number;
}

interface Summary {
  totalRounds: number;
  bestScore: number;
  avgScore: number;
  recentTrend: number;
}

interface StatsData {
  monthly: MonthlyData[];
  byWeather: WeatherData[];
  summary: Summary | null;
}

const WEATHER_LABELS: Record<string, string> = {
  sunny: '☀️맑음',
  cloudy: '☁️흐림',
  rainy: '🌧️비',
  snowy: '❄️눈',
  windy: '💨바람',
};

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => { setData(d); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[var(--gray-50)]">
        <header className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-bold text-[var(--gray-900)]">통계</h1>
        </header>
        <div className="p-5 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.summary) {
    return (
      <div className="flex flex-col h-full bg-[var(--gray-50)]">
        <header className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-bold text-[var(--gray-900)]">통계</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-5">
          <span className="text-5xl">📊</span>
          <p className="text-[var(--gray-500)] text-sm">
            라운딩을 기록하면<br />통계가 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  const { summary, monthly, byWeather } = data;
  const trend = summary.recentTrend;

  return (
    <div className="flex flex-col h-full bg-[var(--gray-50)]">
      <header className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-bold text-[var(--gray-900)]">통계</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-[var(--gray-900)]">{summary.totalRounds}</p>
            <p className="text-xs text-[var(--gray-500)] mt-0.5">총 라운딩</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-[var(--primary-500)]">{summary.bestScore}타</p>
            <p className="text-xs text-[var(--gray-500)] mt-0.5">베스트 스코어</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-[var(--gray-900)]">{summary.avgScore}타</p>
            <p className="text-xs text-[var(--gray-500)] mt-0.5">평균 스코어</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              {trend < 0 ? (
                <TrendingDown size={18} className="text-[var(--primary-500)]" />
              ) : trend > 0 ? (
                <TrendingUp size={18} className="text-[var(--error)]" />
              ) : (
                <Minus size={18} className="text-[var(--gray-500)]" />
              )}
              <p className={`text-2xl font-bold ${
                trend < 0
                  ? 'text-[var(--primary-500)]'
                  : trend > 0
                  ? 'text-[var(--error)]'
                  : 'text-[var(--gray-500)]'
              }`}>
                {trend === 0 ? '-' : `${Math.abs(trend)}타`}
              </p>
            </div>
            <p className="text-xs text-[var(--gray-500)] mt-0.5">전월 대비</p>
          </Card>
        </div>

        {/* 스코어 추이 라인차트 */}
        {monthly.length >= 2 && (
          <Card className="p-5">
            <h2 className="text-sm font-bold text-[var(--gray-900)] mb-4">월별 스코어 추이</h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthly} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  reversed
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}타`,
                    name === 'avg' ? '평균' : '베스트',
                  ]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#1D9E75"
                  strokeWidth={2}
                  dot={{ fill: '#1D9E75', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="best"
                  stroke="#EF9F27"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ fill: '#EF9F27', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-[var(--gray-500)]">
                <span className="w-4 h-0.5 bg-[var(--primary-500)] inline-block" />평균
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--gray-500)]">
                <span className="w-4 h-0.5 bg-[var(--amber-500)] inline-block border-dashed" />베스트
              </span>
            </div>
          </Card>
        )}

        {/* 날씨별 스코어 바차트 */}
        {byWeather.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-bold text-[var(--gray-900)] mb-4">날씨별 평균 스코어</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={byWeather.map((d) => ({
                  ...d,
                  label: WEATHER_LABELS[d.weather] ?? d.weather,
                }))}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  reversed
                />
                <Tooltip
                  formatter={(value) => [`${value}타`, '평균 스코어']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                  {byWeather.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i % 2 === 0 ? '#1D9E75' : '#9FE1CB'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 월별 라운딩 횟수 */}
        {monthly.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-bold text-[var(--gray-900)] mb-4">월별 라운딩 횟수</h2>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={monthly}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                <Tooltip
                  formatter={(value) => [`${value}회`, '라운딩']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="#EF9F27" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}
