/**
 * 배지 마스터 데이터를 DB에 초기 삽입합니다.
 * `npx tsx src/lib/seed-badges.ts` 로 실행하거나 앱 초기화 시 호출.
 */
import 'dotenv/config';
import { prisma } from './db';
import { BADGES } from './constants';

export async function seedBadges() {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        condition: badge.condition,
      },
    });
  }
}

// 직접 실행 시
if (require.main === module) {
  seedBadges()
    .then(() => {
      console.log('배지 시드 완료');
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
