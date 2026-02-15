import { NextResponse } from 'next/server';
import { families } from '@/lib/data';
import type { FamilyProfile } from '@/types';

export function GET() {
  return NextResponse.json(families);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<FamilyProfile>;
    const id = 'f' + Date.now();
    const newFamily: FamilyProfile = {
      id,
      createdAt: new Date().toISOString(),
      contactName: body.contactName ?? '',
      email: body.email ?? '',
      phone: body.phone ?? '',
      location: body.location ?? '',
      householdSize: body.householdSize ?? 1,
      otherChildren: body.otherChildren ?? 0,
      otherAdults: body.otherAdults ?? 0,
      housingType: body.housingType ?? 'house',
      hasYard: body.hasYard ?? false,
      pets: body.pets ?? [],
      preferredAgeRange: body.preferredAgeRange ?? [0, 18],
      preferredSiblingGroup: body.preferredSiblingGroup ?? false,
      openToSpecialNeeds: body.openToSpecialNeeds ?? false,
      maxChildren: body.maxChildren ?? 1,
      languages: body.languages ?? [],
      religion: body.religion,
      occupation: body.occupation ?? '',
      incomeStability: body.incomeStability ?? 'stable',
      verificationStatus: 'pending',
      applicationNotes: body.applicationNotes,
      backgroundCheck: {
        id: 'bc-' + id,
        adopterId: id,
        status: 'pending',
        method: 'manual',
        redFlags: [],
      },
    };
    families.push(newFamily);
    return NextResponse.json(newFamily);
  } catch (e) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
