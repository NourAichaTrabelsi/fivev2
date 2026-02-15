import { NextRequest, NextResponse } from 'next/server';
import { families } from '@/lib/data';
import type { VerificationStatus } from '@/types';

// In production: require admin auth and audit log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { familyId, status, rejectionReason, redFlags } = body as {
      familyId: string;
      status: VerificationStatus;
      rejectionReason?: string;
      redFlags?: string[];
    };

    if (!familyId || !status) {
      return NextResponse.json(
        { error: 'familyId and status required' },
        { status: 400 }
      );
    }

    const valid: VerificationStatus[] = ['pending', 'in_review', 'approved', 'rejected', 'blocked'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const family = families.find((f) => f.id === familyId);
    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    family.verificationStatus = status;
    if (rejectionReason) family.rejectionReason = rejectionReason;
    if (family.backgroundCheck) {
      if (redFlags && redFlags.length) family.backgroundCheck.redFlags = redFlags;
      if (status === 'approved') {
        family.backgroundCheck.status = 'passed';
        family.backgroundCheck.checkedAt = new Date().toISOString();
      }
      if (status === 'rejected' || status === 'blocked') {
        family.backgroundCheck.status = 'failed';
        family.backgroundCheck.checkedAt = new Date().toISOString();
      }
    }

    return NextResponse.json(family);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
