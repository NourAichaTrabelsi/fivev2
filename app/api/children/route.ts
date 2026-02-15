import { NextResponse } from 'next/server';
import { children } from '@/lib/data';

export function GET() {
  return NextResponse.json(children);
}
