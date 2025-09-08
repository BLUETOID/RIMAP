import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Events API endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Events POST endpoint' });
}