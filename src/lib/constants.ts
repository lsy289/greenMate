import type { LevelInfo, BadgeDefinition, WeatherType } from '@/types';

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: '입문자',
    icon: '🌱',
    condition: '첫 라운드 시작',
  },
  {
    level: 2,
    name: '루키 골퍼',
    icon: '⛳',
    condition: '120타 이하 기록',
    maxScore: 120,
  },
  {
    level: 3,
    name: '100타 브레이커',
    icon: '⭐',
    condition: '100타 이하 기록',
    maxScore: 100,
  },
  {
    level: 4,
    name: '90타 브레이커',
    icon: '🏅',
    condition: '90타 이하 기록',
    maxScore: 90,
  },
  {
    level: 5,
    name: '80타 브레이커',
    icon: '🏆',
    condition: '80타 이하 기록',
    maxScore: 80,
  },
];

export const BADGES: BadgeDefinition[] = [
  {
    id: 'debut',
    name: '데뷔전',
    description: '첫 번째 라운드를 기록했습니다',
    icon: '⏳',
    condition: '첫 라운드 기록',
  },
  {
    id: 'first_hole_in_one',
    name: '첫 홀',
    description: '메모에 "홀" 언급 또는 홀인원 입력',
    icon: '🎯',
    condition: '메모에 "홀" 언급 또는 홀인원 입력',
  },
  {
    id: 'streak_3',
    name: '연속 기록',
    description: '3회 연속 라운드를 기록했습니다',
    icon: '🔥',
    condition: '3회 연속 라운드 기록',
  },
  {
    id: 'monthly_4',
    name: '꾸준함의 신',
    description: '한 달에 4회 이상 라운드를 기록했습니다',
    icon: '📅',
    condition: '한 달에 4회 이상 라운드',
  },
  {
    id: 'best_score',
    name: '자기 최고',
    description: '개인 최고 스코어를 갱신했습니다',
    icon: '📈',
    condition: '베스트 스코어 갱신',
  },
];

export const WEATHER_OPTIONS: { value: WeatherType; label: string; icon: string }[] = [
  { value: 'sunny', label: '맑음', icon: '☀️' },
  { value: 'cloudy', label: '흐림', icon: '☁️' },
  { value: 'rainy', label: '비', icon: '🌧️' },
  { value: 'snowy', label: '눈', icon: '❄️' },
  { value: 'windy', label: '바람', icon: '💨' },
];

export const SCORE_BADGE_THRESHOLDS = {
  green: { max: 100 },   // 100타 이하: 초록 배지
  blue: { min: 100, max: 110 },  // 100~110타: 파란 배지
  red: { min: 110 },     // 110타 초과: 빨간 배지
} as const;
