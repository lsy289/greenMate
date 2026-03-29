import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export interface PlaceItem {
  title: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const query = req.nextUrl.searchParams.get('query')?.trim();
  if (!query || query.length < 2) return NextResponse.json({ items: [] });

  const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
  const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ items: [] });
  }

  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query + ' 골프')}&display=5&sort=comment`;

  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  });

  if (!res.ok) return NextResponse.json({ items: [] });

  const data = await res.json();
  const items: PlaceItem[] = (data.items ?? []).map((item: PlaceItem) => ({
    title: item.title.replace(/<[^>]+>/g, ''),
    address: item.address,
    roadAddress: item.roadAddress,
    mapx: item.mapx,
    mapy: item.mapy,
  }));

  return NextResponse.json({ items });
}
