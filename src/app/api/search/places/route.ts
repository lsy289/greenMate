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

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) return NextResponse.json({ items: [] });

  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query + ' 골프')}&size=5`;

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!res.ok) return NextResponse.json({ items: [] });

  const data = await res.json();
  const items: PlaceItem[] = (data.documents ?? []).map((doc: {
    place_name: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
  }) => ({
    title: doc.place_name,
    address: doc.address_name,
    roadAddress: doc.road_address_name || doc.address_name,
    mapx: doc.x,
    mapy: doc.y,
  }));

  return NextResponse.json({ items });
}
