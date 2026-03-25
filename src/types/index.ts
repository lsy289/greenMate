export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Round {
  id: string;
  userId: string;
  date: Date;
  courseName: string;
  weather: WeatherType;
  score: number;
  memo?: string;
  photos?: string[]; // image URL 배열
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface UserLevel {
  id: string;
  userId: string;
  currentLevel: number; // 1: 입문자, 2: 루키, 3: 100타, 4: 90타, 5: 80타
  bestScore: number;
  totalRounds: number;
  updatedAt: Date;
}

export interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  condition: string;
  minScore?: number;
  maxScore?: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export type ScoreBadgeColor = 'green' | 'blue' | 'red';

export interface RoundFormData {
  date: Date;
  courseName: string;
  weather: WeatherType;
  score: number;
  memo?: string;
  photos?: File[];
}
