import { NextRequest, NextResponse } from 'next/server';
import { families, children } from '@/lib/data';
import { getMatchesForFamily, getMatchesForChild } from '@/lib/match';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const familyId = searchParams.get('familyId');
  const childId = searchParams.get('childId');

  if (familyId) {
    const results = getMatchesForFamily(familyId, families, children);
    return NextResponse.json(results);
  }
  if (childId) {
    const results = getMatchesForChild(childId, families, children);
    return NextResponse.json(results);
  }
  return NextResponse.json(
    { error: 'Provide familyId or childId' },
    { status: 400 }
  );
}
