import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Alumni API endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Alumni POST endpoint' });
}